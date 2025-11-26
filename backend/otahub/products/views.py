from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from .models import Category, Product, CartItem, HistorialCompra
from .serializers import (
    CategorySerializer, ProductSerializer, CartItemSerializer,
    UserSerializer, RegisterSerializer, HistorialCompraSerializer
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import stripe
from django.conf import settings
import json


# Create your views here.
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset



class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user).order_by("-id")

    # CREATE — Agregar producto al carrito
    def create(self, request, *args, **kwargs):
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))

        # Validación: producto existe
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Producto no encontrado"}, status=404)

        # Validación: stock disponible
        if quantity < 1:
            return Response({"error": "Cantidad inválida"}, status=400)

        if product.stock < quantity:
            return Response({"error": "No hay stock suficiente"}, status=400)

        # Si el producto ya está en el carrito del usuario → aumentar cantidad
        existing = CartItem.objects.filter(user=request.user, product=product).first()
        if existing:
            if existing.quantity + quantity > product.stock:
                return Response({"error": "Stock insuficiente"}, status=400)

            existing.quantity += quantity
            existing.save()
            return Response(CartItemSerializer(existing).data, status=200)

        # Crear nuevo ítem
        cart_item = CartItem.objects.create(
            user=request.user,
            product=product,
            quantity=quantity
        )
        return Response(CartItemSerializer(cart_item).data, status=201)

    # UPDATE — Actualizar cantidad
    def update(self, request, *args, **kwargs):
        item = self.get_object()
        # Verificar que el item pertenece al usuario
        if item.user != request.user:
            return Response({"error": "No autorizado"}, status=403)
        
        new_quantity = int(request.data.get("quantity", 1))

        if new_quantity < 1:
            return Response({"error": "Cantidad inválida"}, status=400)

        # Validar stock
        if new_quantity > item.product.stock:
            return Response({"error": "Stock insuficiente"}, status=400)

        item.quantity = new_quantity
        item.save()

        return Response(CartItemSerializer(item).data)

    # DELETE — eliminar ítem del carrito
    def destroy(self, request, *args, **kwargs):
        item = self.get_object()
        # Verificar que el item pertenece al usuario
        if item.user != request.user:
            return Response({"error": "No autorizado"}, status=403)
        item.delete()
        return Response({"message": "Producto eliminado del carrito"}, status=204)

    # Acción extra: limpiar carrito
    @action(detail=False, methods=["delete"])
    def clear(self, request):
        CartItem.objects.filter(user=request.user).delete()
        return Response({"message": "Carrito vacío correctamente"})


# Views de Autenticación
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


# Views de Historial de Compras
class HistorialCompraViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = HistorialCompraSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return HistorialCompra.objects.filter(usuario=self.request.user).order_by('-fecha')


# Views de Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    try:
        # Obtener items del carrito del usuario
        cart_items = CartItem.objects.filter(user=request.user)
        
        if not cart_items.exists():
            return Response({"error": "El carrito está vacío"}, status=status.HTTP_400_BAD_REQUEST)

        # Preparar line items para Stripe
        line_items = []
        total = 0
        
        for item in cart_items:
            # Validar stock antes de crear la sesión
            if item.quantity > item.product.stock:
                return Response(
                    {"error": f"No hay stock suficiente para {item.product.name}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Stripe espera precios en centavos (o la unidad mínima de la moneda)
            # Asumiendo que el precio está en soles, lo convertimos a centavos
            price_in_cents = int(float(item.product.price) * 100)
            
            # Preparar datos del producto
            product_data = {
                'name': item.product.name,
            }
            
            # Agregar imagen solo si existe y tiene URL absoluta
            if item.product.image:
                try:
                    # Construir URL absoluta de la imagen
                    image_url = request.build_absolute_uri(item.product.image.url)
                    product_data['images'] = [image_url]
                except:
                    # Si hay error, no agregar imagen
                    pass
            
            line_items.append({
                'price_data': {
                    'currency': 'pen',  # PEN para soles peruanos
                    'product_data': product_data,
                    'unit_amount': price_in_cents,
                },
                'quantity': item.quantity,
            })
            
            total += float(item.product.price) * item.quantity

        # Crear sesión de checkout en Stripe
        # URL del frontend para success - Stripe requiere URLs absolutas
        # El placeholder {CHECKOUT_SESSION_ID} será reemplazado por Stripe
        frontend_url = "http://localhost:5173"
        success_url = frontend_url + "/success?session_id={CHECKOUT_SESSION_ID}"
        cancel_url = frontend_url + "/carrito"
        
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                'user_id': str(request.user.id),
            }
        )

        return Response({
            'sessionId': checkout_session.id,
            'url': checkout_session.url
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        return Response({"error": "Invalid payload"}, status=400)
    except stripe.error.SignatureVerificationError as e:
        return Response({"error": "Invalid signature"}, status=400)

    # Manejar el evento checkout.session.completed
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        user_id = session['metadata'].get('user_id')
        if not user_id:
            return Response({"error": "No user_id in metadata"}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        # Obtener items del carrito del usuario
        cart_items = CartItem.objects.filter(user=user)
        
        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=400)

        # Calcular total
        total = sum(float(item.product.price) * item.quantity for item in cart_items)
        
        # Obtener productos
        productos = [item.product for item in cart_items]
        
        # Crear registro de historial de compra
        historial = HistorialCompra.objects.create(
            usuario=user,
            total=total,
            stripe_session_id=session['id']
        )
        historial.productos.set(productos)
        
        # Actualizar stock y eliminar items del carrito
        for item in cart_items:
            product = item.product
            product.stock -= item.quantity
            product.save()
        
        # Eliminar items del carrito después de actualizar stock
        cart_items.delete()
        
        return Response({"status": "success"}, status=200)

        return Response({"status": "success"}, status=200)

    return Response({"status": "event not handled"}, status=200)

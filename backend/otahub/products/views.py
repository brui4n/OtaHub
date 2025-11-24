from django.shortcuts import render
from rest_framework import viewsets, status
from .models import Category, Product, CartItem 
from .serializers import CategorySerializer, ProductSerializer, CartItemSerializer
from rest_framework.response import Response
from rest_framework.decorators import action


# Create your views here.
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset



class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all().order_by("-id")
    serializer_class = CartItemSerializer

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

        # Si el producto ya está en el carrito → aumentar cantidad
        existing = CartItem.objects.filter(product=product).first()
        if existing:
            if existing.quantity + quantity > product.stock:
                return Response({"error": "Stock insuficiente"}, status=400)

            existing.quantity += quantity
            existing.save()
            return Response(CartItemSerializer(existing).data, status=200)

        # Crear nuevo ítem
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=201)

    # UPDATE — Actualizar cantidad
    def update(self, request, *args, **kwargs):
        item = self.get_object()
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
        item.delete()
        return Response({"message": "Producto eliminado del carrito"}, status=204)

    # Acción extra: limpiar carrito
    @action(detail=False, methods=["delete"])
    def clear(self, request):
        CartItem.objects.all().delete()
        return Response({"message": "Carrito vacío correctamente"})

from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import *

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url = True)
    category = CategorySerializer(read_only = True)

    class Meta:
        model = Product
        fields = '__all__'


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only = True)

    product_id = serializers.PrimaryKeyRelatedField(
        queryset = Product.objects.all(),
        write_only = True,
        source='product'
    )
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'created_at', 'updated_at']


# Serializers para Autenticación
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'password2', 'email', 'first_name', 'last_name']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        return user


# Serializer para Historial de Compras
class HistorialCompraSerializer(serializers.ModelSerializer):
    productos = ProductSerializer(many=True, read_only=True)
    usuario = UserSerializer(read_only=True)

    class Meta:
        model = HistorialCompra
        fields = ['id', 'usuario', 'productos', 'total', 'fecha', 'stripe_session_id']
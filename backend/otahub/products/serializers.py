from rest_framework import serializers
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
        write_only = True
    )
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'producto_id', 'quantity', 'created_at', 'updated_at']
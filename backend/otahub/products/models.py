from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    image = models.ImageField(upload_to='categories/', null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class Product(models.Model):
    name = models.CharField(max_length=150)
    volume = models.IntegerField(null=True, blank=True)
    author = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    stock = models.IntegerField(default=0)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    description = models.TextField()

    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart_items", null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="cart_items")
    quantity = models.IntegerField(default=1)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.product.name} x {self.quantity}'

    class Meta:
        # No usamos unique_together porque user puede ser null
        # La lógica de unicidad se maneja en la vista
        pass


class HistorialCompra(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="compras")
    productos = models.ManyToManyField(Product, related_name="compras")
    total = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True)
    stripe_session_id = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f'Compra de {self.usuario.username} - {self.fecha.strftime("%Y-%m-%d %H:%M")} - S/. {self.total}'
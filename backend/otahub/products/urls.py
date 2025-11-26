from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import (
    CategoryViewSet, ProductViewSet, CartItemViewSet,
    register, CustomTokenObtainPairView, me,
    HistorialCompraViewSet, create_checkout_session, stripe_webhook
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'cart', CartItemViewSet, basename='cart')
router.register(r'historial', HistorialCompraViewSet, basename='historial')

urlpatterns = router.urls

# URLs de autenticación
urlpatterns += [
    path('auth/register/', register, name='register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('auth/me/', me, name='me'),
]

# URLs de pagos
urlpatterns += [
    path('pay/create-checkout-session/', create_checkout_session, name='create-checkout-session'),
    path('pay/webhook/', stripe_webhook, name='stripe-webhook'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from .views import CategoryViewSet, ProductViewSet, CartItemViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'cart', CartItemViewSet)

urlpatterns = router.urls

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
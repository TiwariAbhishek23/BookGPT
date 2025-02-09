from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UploadViewSet, ragChatBot

# Create a router and register the ViewSet
router = DefaultRouter()
router.register(r'upload-pdf', UploadViewSet, basename='upload')

urlpatterns = [
    path('', ragChatBot, name='ragChatBot'),
    path('api/', include(router.urls)),  # Include the ViewSet URLs
]
from django.urls import path
from . import views

urlpatterns = [
    path('', views.chat, name='chat'),
    path('api/message/', views.message_api, name='message_api'),
]

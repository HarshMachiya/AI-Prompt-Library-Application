from django.urls import path
from . import views

urlpatterns = [
    path('prompts/', views.prompt_collection, name='prompt-collection'),
    path('prompts/<uuid:pk>/', views.prompt_detail, name='prompt-detail'),
]

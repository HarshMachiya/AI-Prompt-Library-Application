from django.db import models
import uuid

class Prompt(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    content = models.TextField()
    complexity = models.IntegerField(default=1)
    view_count = models.IntegerField(default=0)  # Database fallback for view counts
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

from django.db import models

# Create your models here.
class UploadedPDF(models.Model):
    pdf = models.FileField(upload_to='pdfs/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.pdf.name
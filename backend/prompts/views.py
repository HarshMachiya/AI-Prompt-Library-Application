import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Prompt
from .utils import increment_view_count

@csrf_exempt
def prompt_collection(request):
    if request.method == "GET":
        # Use .values() to avoid loading full Python objects - much faster
        prompts = list(Prompt.objects.values(
            'id', 'title', 'content', 'complexity', 'created_at'
        ).order_by('-created_at'))
        # Convert UUID and datetime to string
        for p in prompts:
            p['id'] = str(p['id'])
            p['created_at'] = p['created_at'].isoformat()
        response = JsonResponse(prompts, safe=False)
        response['Cache-Control'] = 'no-cache'
        return response

    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            title = data.get("title", "").strip()
            content = data.get("content", "").strip()
            complexity = data.get("complexity")

            if not title or len(title) < 3:
                return JsonResponse({"error": "Title must be at least 3 characters"}, status=400)
            if not content or len(content) < 20:
                return JsonResponse({"error": "Content must be at least 20 characters"}, status=400)
            if complexity is None or not (1 <= int(complexity) <= 10):
                return JsonResponse({"error": "Complexity must be between 1 and 10"}, status=400)

            prompt = Prompt.objects.create(
                title=title, content=content, complexity=int(complexity)
            )
            return JsonResponse({
                "id": str(prompt.id),
                "title": prompt.title,
                "complexity": prompt.complexity,
                "created_at": prompt.created_at.isoformat()
            }, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Method not allowed"}, status=405)

def prompt_detail(request, pk):
    if request.method == "GET":
        try:
            prompt = Prompt.objects.get(pk=pk)
            view_count = increment_view_count(str(prompt.id))
            if view_count == 0:
                prompt.view_count += 1
                prompt.save(update_fields=['view_count'])
                view_count = prompt.view_count

            return JsonResponse({
                "id": str(prompt.id),
                "title": prompt.title,
                "content": prompt.content,
                "complexity": prompt.complexity,
                "view_count": view_count,
                "created_at": prompt.created_at.isoformat()
            })
        except Prompt.DoesNotExist:
            return JsonResponse({"error": "Prompt not found"}, status=404)

    return JsonResponse({"error": "Method not allowed"}, status=405)

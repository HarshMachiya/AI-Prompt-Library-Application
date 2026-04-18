import redis
from django.conf import settings

def get_redis_client():
    try:
        r = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            db=0,
            decode_responses=True,
            socket_connect_timeout=1
        )
        r.ping()
        return r
    except:
        return None

def increment_view_count(prompt_id):
    r = get_redis_client()
    if r:
        key = f"prompt:{prompt_id}:views"
        return r.incr(key)
    return 0

def get_view_count(prompt_id):
    r = get_redis_client()
    if r:
        key = f"prompt:{prompt_id}:views"
        count = r.get(key)
        return int(count) if count else 0
    return 0

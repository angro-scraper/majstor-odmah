from collections import defaultdict, deque
from time import monotonic

from fastapi import HTTPException, Request, status


class InMemoryRateLimiter:
    """Development fallback. Production implementation is backed by Redis."""

    def __init__(self, limit: int = 100, window_seconds: int = 60) -> None:
        self.limit = limit
        self.window_seconds = window_seconds
        self._requests: dict[str, deque[float]] = defaultdict(deque)

    async def __call__(self, request: Request) -> None:
        key = request.client.host if request.client else "unknown"
        now = monotonic()
        timestamps = self._requests[key]
        while timestamps and timestamps[0] <= now - self.window_seconds:
            timestamps.popleft()
        if len(timestamps) >= self.limit:
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Previše zahteva. Pokušaj ponovo uskoro.")
        timestamps.append(now)


api_rate_limit = InMemoryRateLimiter()

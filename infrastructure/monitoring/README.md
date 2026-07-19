# Monitoring integration checklist

The application emits structured request logs to stdout and exposes `/api/v1/health`
and `/api/v1/health/ready`. Attach the managed host's log drain and a monitored
uptime check before production launch.

Recommended production signals: availability, 5xx rate, p95 latency, CPU/memory,
database connections/storage, failed logins, financial risk flags, and backup
restore success. Do not put DSNs, alert webhooks, or provider credentials in Git.

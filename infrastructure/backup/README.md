# Backup runbook placeholder

Configure encrypted managed PostgreSQL backups and S3-compatible object storage
versioning in the production provider. A backup is not accepted as complete until
it has been restored into an isolated environment and its schema/version checks
have passed. The full process and initial RPO/RTO targets are in
`docs/global-operations-security.md`.

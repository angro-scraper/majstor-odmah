# Balkan.works Portal

Nezavisan Python/FastAPI web portal za Balkan.works super-aplikaciju.

Ovaj servis je namerno odvojen od postojeće Majstor aplikacije. Prikazuje module platforme, prilagođen je mobilnim ekranima i proverava dostupnost Core API-ja preko `CORE_API_URL` promenljive.

## Lokalno pokretanje

```powershell
cd balkan_portal
pip install -r requirements.txt
uvicorn app:app --reload --port 8090
```

Otvoriti `http://localhost:8090`.

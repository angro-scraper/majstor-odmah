# Balkan.works Core Platform

Python backend za regionalnu Balkan.works platformu. Sistem počinje kao modularni monolit, ali su moduli izolovani tako da se kasnije mogu izdvojiti kao zasebni servisi.

## Prva isporuka

- Identity i JWT autentifikacija
- Core profil, jezici, države, gradovi i GPS pretraga
- Business Engine za profile firmi i verifikaciju
- Category katalog
- Offer Engine za Deals, digitalne flajere i Save Food ponude
- RBAC, audit log, rate limiting i OpenAPI dokumentacija
- Strukture za Marketplace, Save Food, Business Tools, Payments, Notifications i Admin

## Pokretanje lokalno

```powershell
cd balkan_platform
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8080
```

Dokumentacija API-ja je zatim na `http://localhost:8080/docs`.

## Pokretanje sa Dockerom

```powershell
docker compose up --build
```

## Moduli

| Modul | Odgovornost | Status |
| --- | --- | --- |
| `identity` | korisnici, uloge, JWT, profil | aktivan |
| `location` | države, gradovi, GPS/radius search | aktivan |
| `business` | firme, verifikacija, članovi | aktivan |
| `catalog` | zajedničke kategorije | aktivan |
| `offers` | Deals, flajeri i ponude | aktivan |
| `marketplace` | oglasi, usluge, poslovi, favoriti | struktura spremna |
| `save_food` | paketi hrane i rezervacije | struktura spremna |
| `business_tools` | Opsnestone adapteri | struktura spremna |
| `payments` | wallet, transakcije, pretplate | struktura spremna |
| `notifications` | push, email i SMS | struktura spremna |
| `admin` | moderacija, statistika, audit | aktivan skeleton |

## Migracije

Alembic migracije su u `alembic/versions`. Prva migracija kreira Core + Business + Offers šemu.

```powershell
alembic upgrade head
```

## Produkcija

Obavezne promenljive:

- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — jedinstvena tajna od najmanje 32 karaktera
- `REDIS_URL` — Redis za rate limit i kasnije notifikacije/cache
- `CORS_ORIGINS` — dozvoljeni Web i mobilni origin-i

U produkciji se `AUTO_CREATE_SCHEMA` drži na `false`; šema se menja samo kroz Alembic migracije.

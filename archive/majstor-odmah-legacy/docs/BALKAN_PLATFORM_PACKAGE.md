# Balkan.works platform package

Ovaj paket pokreće četiri odvojene komponente zajedno:

1. `portal` — javni Balkan.works super-app shell na portu `8090`.
2. `core` — modularni REST API na portu `8080`.
3. `postgres` — trajna Core baza.
4. `redis` — cache/rate-limit osnova.

## Lokalni kompletan start

```powershell
docker compose -f platform-compose.yml up --build
```

Zatim:

- Portal: `http://localhost:8090`
- Core API: `http://localhost:8080/docs`

`core` pri startu izvršava Alembic migracije pre nego što pokrene API. Lokalna lozinka i JWT tajna u compose fajlu služe samo za razvoj — produkcija koristi Render environment promenljive i izolovanu Supabase šemu `balkan_core`.

## Produkcioni raspored

| Servis | Produkcioni URL | Odgovornost |
| --- | --- | --- |
| Portal | `balkan-works-portal.onrender.com` | Javni početni portal i registracija |
| Core | `balkan-works-core.onrender.com` | API, autentifikacija i moduli |
| Majstor | postojeći odvojeni servis | Ostaje netaknut dok domen ne bude svesno preusmeren |

Pre povezivanja `balkan.works` proveravaju se portal, registracija i Core API. Tek tada se namerno menja custom-domain veza; DNS i postojeći Majstor servis se do tada ne dodiruju.

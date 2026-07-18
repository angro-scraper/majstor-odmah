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

## Operativni admin panel

`/admin` je kontrolni centar za Core platformu: pregled metrika, korisnika,
firmi koje čekaju verifikaciju, marketplace oglasa i audit traga. Sve odluke se
izvršavaju kroz zaštićeni Core API; portal ne sadrži administratorsku lozinku.

Pristup imaju samo nalozi sa Core ulogom `ADMIN` ili `MODERATOR`. Prvi takav
nalog se dodeljuje kontrolisano u bazi tokom administrator-onboardinga — javna
registracija nikada ne može sama sebi dodeliti administrativnu ulogu.

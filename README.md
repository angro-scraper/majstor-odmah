# Majstor odmah

MVP platforma za pronalazak dostupnih i ocenjenih majstora u blizini.

## Lokalno pokretanje

```bash
npm start
```

Zatim otvori `http://localhost:3000`.

## Deploy na Render

Repozitorijum sadrži `render.yaml`. Render pokreće aplikaciju komandom `npm start` i prosleđuje port kroz promenljivu `PORT`.

> Napomena: trenutna `data.json` baza je lokalna demonstracija. Na Render free instanci podaci nisu trajni nakon novog deploy-a; za produkciju uključi Supabase.

## Supabase: pravi nalozi, verifikacija i obaveštenja

1. U Supabase SQL Editor-u jednom pokreni `supabase/admin-moderation.sql` (ako je početna šema već kreirana).
2. U Render servis dodaj sledeće environment varijable — vrednosti se unose direktno u Render, nikada u kod ili chat:

   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

3. Sačuvaj varijable i sačekaj novi deploy. Dugme **Registracija ili prijava** tada otvara stvarni nalog, dok su demo nalozi i dalje dostupni za prezentaciju.

Majstori dobijaju status `Čeka proveru`; administrator ih iz panela može potvrditi ili odbiti. Blokiran nalog ne može da se prijavi, a korisnik dobija početno obaveštenje u aplikaciji.

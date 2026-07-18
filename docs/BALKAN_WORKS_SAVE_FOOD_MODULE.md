# Balkan.works Save Food Module

Save Food povezuje verifikovane firme sa korisnicima koji žele preuzeti ograničene pakete hrane u definisanom vremenu.

## Tok

1. Vlasnik kreira draft paket sa količinom, cenom i terminom preuzimanja.
2. Vlasnik ga aktivira kada je spreman.
3. Korisnik vidi samo aktivne, dostupne i neistekle pakete.
4. Rezervacija atomski smanjuje dostupnu količinu.
5. Korisnik može otkazati rezervaciju pre početka preuzimanja; količina se vraća.

## API

- `GET /api/v1/save-food/packages`
- `GET /api/v1/save-food/packages/:id`
- `POST /api/v1/save-food/packages`
- `PATCH /api/v1/save-food/packages/:id`
- `POST /api/v1/save-food/packages/:id/activate`
- `POST /api/v1/save-food/packages/:id/reserve`
- `GET /api/v1/save-food/reservations/me`
- `POST /api/v1/save-food/reservations/:id/cancel`

Modul kontroliše `SAVE_FOOD_ENABLED`; inicijalno je uključen u skladu sa trenutnim MVP standardom. Plaćanje, refund i predikcija viškova hrane nisu deo ove faze.

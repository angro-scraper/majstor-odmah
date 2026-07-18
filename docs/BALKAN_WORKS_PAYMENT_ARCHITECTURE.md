# Balkan.works Payment Architecture

## Princip

Plaćanja se uvode samo kroz licenciranog payment provajdera. Balkan.works ne obrađuje niti skladišti brojeve kartica, CVV ili osetljive autentikacione podatke.

## Tok

`checkout zahtev → server validira cenu i prava → provajder kreira payment intent → korisnik potvrđuje → verifikovan webhook → poslovni događaj → račun/obaveštenje`.

Klijent nikada ne sme sam da odredi iznos, status plaćanja ili pravo na refund. Webhook se potpisuje, čuva se idempotency key i svaka promena statusa ima audit trag.

## Prvi podržani slučajevi

1. Pretplata firme na Starter/Growth plan.
2. Promocija digitalnog flajera ili ponude.
3. Kasnije: rezervacija ili marketplace transakcija.

## Stanja transakcije

`PENDING → REQUIRES_ACTION → PAID | FAILED | CANCELLED | REFUNDED`. Poslovna usluga reaguje samo na potvrđeni server-side status.

## Refund i sporovi

Refund ima vlasnika, razlog, iznos, vezu sa originalnom transakcijom i obaveštenje korisniku. Za marketplace se pre lansiranja definišu rokovi, dokaz isporuke, eskalacija i lokalni pravni zahtevi.

## Bezbednosne kontrole

- stroge dozvole po firmi i resursu;
- verifikovani webhook potpis i replay zaštita;
- rate limit i monitoring neuspeha;
- dnevna finansijska rekonsilijacija;
- nikakvi kartični podaci u logovima, analitici ili backup-u.

Wallet je zaseban, regulisan proizvod i ostaje isključen dok pravna, računovodstvena i sigurnosna osnova ne bude odobrena.

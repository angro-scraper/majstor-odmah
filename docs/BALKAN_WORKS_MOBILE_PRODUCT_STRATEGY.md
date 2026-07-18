# Balkan.works Mobile Product Strategy

## Uloga mobilne aplikacije

Mobilna aplikacija je najbrži lokalni interfejs za pronalaženje, čuvanje i korišćenje ponuda. Web ostaje primarni SEO i onboarding kanal; mobilna aplikacija se ne gradi kao drugačiji proizvod.

## Tehnologija

React Native + Expo koristi isti API ugovor, tipove, dizajn tokene i feature flagove kao web. Native mogućnosti se uvode postepeno: lokacija, kamera za sadržaj, push obaveštenja i deljenje.

## MVP mobilni tok

1. dobrodošlica i prijava;
2. izbor grada i dozvole lokacije;
3. home sa lokalnim rezultatima, ponudama i flajerima;
4. pretraga i profil firme;
5. favorite, notifikacije i profil;
6. Save Food rezervacija kada je modul aktivan.

## Push pravila

Push je opt-in, lokalno relevantan i ograničen frekvencijom. Kategorije su: sačuvana firma, rezervacija, sistemska bezbednost i preporuka. Svaka poruka ima razlog, deep link i mogućnost odjave.

## Offline

Offline podržava samo bezbedne prikaze: poslednje sačuvane firme, poslednje otvorene rezultate i jasno označenu zastarelost. Rezervacije, plaćanja i izmene profila zahtevaju mrežu i potvrdu servera.

## Kvalitet

Prati se vreme do prve vrednosti, stopa dozvole lokacije, crash-free korisnici, uspeh deep linka, potrošnja mreže i pristupačnost. Svaki novi mobilni ekran koristi postojeći UI paket.

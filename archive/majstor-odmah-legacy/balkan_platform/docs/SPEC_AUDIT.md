# Balkan.works Core — audit specifikacije

Status ovog repozitorijuma nakon prve pune implementacije:

| Oblast | Status | Napomena |
| --- | --- | --- |
| Modularni monolit, PostgreSQL, Docker, REST, JWT, RBAC | Implementirano | Python/FastAPI, ne NestJS — tako je prethodno odabrano zbog zahteva za Python kodom. |
| Identity, profil, uloge, lokalizacija | Implementirano | Registracija, login, JWT i profil su aktivni. Email/SMS verifikacija i reset imaju potrebna polja, ali ne smeju biti aktivirani bez stvarnog SMTP/SMS provajdera. |
| Business, kategorije, lokacije i geo pretraga | Implementirano | Firme, verifikacija, države/gradovi i nearby-cities API. |
| Marketplace | Implementirano | Oglasi, favoriti, poruke i ocene. Slike se trenutno čuvaju kao URL-ovi; S3 provider je sledeća infrastrukturna veza. |
| Offers / Deals | Implementirano | Kreiranje i javna pretraga ponuda po lokaciji i izvoru. |
| Save Food | Implementirano | Paketi i rezervacije; plaćanje ostaje odvojeni Payment provider korak. |
| Opsnestone | Adapter skeleton | Capability API je spreman, ali prava integracija zahteva Opsnestone API ugovor i kredencijale. |
| Payments | Struktura implementirana | Wallet i PENDING payment intent postoje; stvarni procesor se ne implementira bez odabranog licenciranog PSP-a. |
| Notifications | In-app implementirano | Push/email/SMS zahtevaju FCM, SMTP i SMS provajdera. |
| Admin / moderacija | Implementirano | Dashboard, verifikacija firme, lista korisnika, blokiranje korisnika i skrivanje oglasa uz audit log. |
| Redis | Konfiguracija spremna | Potrebna je zasebna Redis instanca za distribuirani cache/rate limit pri rastu. |
| React/Next admin i React Native | Nije pokrenuto | Javni portal je odvojen FastAPI servis; mobilna aplikacija i pun Next.js admin su sledeći klijenti Core API-ja. |

## Granice odgovorne implementacije

Ne označavamo kao završeno ono što zahteva eksterni ugovor, plaćanja ili provajder kredencijale. To su: SMTP/SMS/FCM, S3 storage, pravi payment processor i Opsnestone API. Core API već ima odvojene module u koje se bez menjanja jezgra dodaju adapteri.

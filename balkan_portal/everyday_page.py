"""Public entry page for native Balkan Everyday modules."""


def render_everyday_page() -> str:
    cards = [
        ("🩺", "Health", "Ordinacije, laboratorije, stomatolozi i zahtevi za termin.", "Temelj spreman"),
        ("💊", "Pharmacy", "Apoteke u blizini i zahtev za rezervaciju proizvoda.", "Temelj spreman"),
        ("🏦", "Bill Pay", "Računi i podsetnici. Plaćanje se aktivira uz licenciranog partnera.", "Podsetnici aktivni"),
        ("⛽", "Fuel Tracker", "Pumpe, lokacija i partner akcije. Realne cene traže provereni feed.", "Direktorijum spreman"),
        ("🅿️", "Parking", "Podsetnik pre isteka parkiranja; gradsko plaćanje dolazi uz integraciju.", "Podsetnici aktivni"),
        ("🏘️", "Nekretnine", "Prodaja, izdavanje, cimeri i kratkoročni smeštaj.", "Oglasi spremni"),
        ("🎁", "Poklon kartice", "Digitalni vaučeri partnera u jednom Balkan ID nalogu.", "Struktura spremna"),
        ("🐶", "Pet", "Veterinari, pet shopovi i lokalne usluge za ljubimce.", "Direktorijum spreman"),
        ("👨‍👩‍👧", "Family", "Porodična grupa, zajednički Rewards i budući zajednički budžet.", "Opt-in osnova"),
        ("🌱", "Green Score", "Prati spasenu hranu i procenjeni CO₂ uticaj uz jasnu metodologiju.", "Aktivan"),
    ]
    cards_html = "".join(f'<article><span>{icon}</span><h2>{title}</h2><p>{description}</p><b>{state}</b></article>' for icon, title, description, state in cards)
    return f'''<!doctype html><html lang="sr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Balkan Everyday · Balkan.works</title><style>
    :root{{--ink:#092c26;--pine:#0d4036;--paper:#f8f8f4;--card:#fff;--orange:#ff6c37;--line:#d9e3dc;--muted:#62746e}}*{{box-sizing:border-box}}body{{margin:0;background:var(--paper);color:var(--ink);font-family:Inter,system-ui,sans-serif}}main{{max-width:1440px;margin:auto;padding:30px 40px 70px}}a{{color:inherit}}.brand{{font-weight:950;font-size:25px;text-decoration:none}}.brand i{{color:var(--orange)}}.hero{{margin-top:30px;border-radius:26px;background:linear-gradient(135deg,#0d4036,#165b4a);color:#fff;padding:48px}}.eyebrow{{color:var(--orange);font-weight:900;letter-spacing:1.3px;font-size:11px;text-transform:uppercase}}h1{{font:clamp(38px,5vw,68px)/.98 Georgia,serif;letter-spacing:-2px;max-width:720px;margin:12px 0}}.hero p{{max-width:700px;color:#d6e6de;line-height:1.55}}.grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px;margin-top:30px}}article{{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:20px;min-height:210px}}article span{{font-size:30px}}h2{{margin:15px 0 8px;font-size:19px}}article p{{color:var(--muted);font-size:14px;line-height:1.45}}article b{{color:var(--orange);font-size:12px}}.note{{margin-top:30px;border-left:4px solid var(--orange);padding:15px 18px;background:#fff4ed;color:var(--muted);line-height:1.5}}@media(max-width:700px){{main{{padding:22px 16px 50px}}.hero{{padding:30px 22px}}}}
    </style><main><a class="brand" href="/">balkan<i>.</i>works</a><section class="hero"><div class="eyebrow">Balkan Everyday</div><h1>Važne svakodnevne stvari — u jednom nalogu.</h1><p>Ovo su nativni moduli Balkan.works. Nikakav medicinski zapis, račun, plaćanje ili podatak partnera se ne preuzima bez posebne, bezbedne integracije.</p></section><section class="grid">{cards_html}</section><p class="note">Balkan.works je centralna aplikacija. Spoljne platforme i provajderi se kasnije priključuju preko eksplicitnih ugovora i API dozvola, dok Balkan ID ostaje jedan zajednički nalog.</p></main></html>'''

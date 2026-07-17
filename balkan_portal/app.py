"""Balkan.works public super-app portal (independent Python web service)."""
from __future__ import annotations

import os
from html import escape

import httpx
from fastapi import FastAPI, Query
from fastapi.responses import HTMLResponse, JSONResponse

APP_NAME = "Balkan.works"
CORE_URL = os.getenv("CORE_API_URL", "https://balkan-works-core.onrender.com").rstrip("/")

app = FastAPI(title="Balkan.works Portal", docs_url=None, redoc_url=None)

MODULES = [
    ("work", "Balkan.Works", "Poslovi, majstori i lokalne usluge", "Pronađi proverene ljude i firme u svom gradu.", "Aktivno"),
    ("deals", "Deals", "Akcije i digitalni flajeri", "Ponude iz prodavnica koje pratiš, bez papirnih flajera.", "Uskoro"),
    ("food", "Save Food", "Sačuvaj dobru hranu", "Rezerviši pakete viška hrane u blizini.", "Uskoro"),
    ("business", "Business", "Alati za firme", "Ponude, profil firme i alati za svakodnevni posao.", "Uskoro"),
    ("money", "Money", "Pametnije sa novcem", "Budžet, edukacija i finansijski alati za kasnije.", "Planirano"),
]


async def core_status() -> str:
    try:
        async with httpx.AsyncClient(timeout=4) as client:
            response = await client.get(f"{CORE_URL}/health")
            response.raise_for_status()
        return "online"
    except (httpx.HTTPError, ValueError):
        return "checking"


def page(language: str, status: str) -> str:
    language = language if language in {"SR", "HR", "BS", "MK", "EN", "DE"} else "SR"
    cards = "".join(
        f'''<button class="module-card {key}" data-module="{key}" data-title="{escape(title)}">
              <span class="module-icon">{icon(key)}</span><span class="status {badge.lower()}">{badge}</span>
              <strong>{escape(title)}</strong><b>{escape(subtitle)}</b><small>{escape(description)}</small>
              <span class="arrow">Otvori →</span></button>'''
        for key, title, subtitle, description, badge in MODULES
    )
    core_label = "Core je povezan" if status == "online" else "Proveravamo Core"
    return f'''<!doctype html><html lang="{language.lower()}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{APP_NAME} — sve lokalno, na jednom mestu</title><style>
:root{{--ink:#092c26;--pine:#0d4036;--mint:#e5f5eb;--lime:#b8eea7;--paper:#fbfaf6;--orange:#ff6c37;--muted:#62746e;--line:#d9e3dc}}*{{box-sizing:border-box}}body{{margin:0;background:var(--paper);color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,sans-serif}}button{{font:inherit}}.wrap{{max-width:1200px;margin:auto;padding:0 28px}}nav{{height:78px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line)}}.brand{{font-weight:900;font-size:24px;letter-spacing:-1.1px;text-decoration:none;color:var(--ink)}}.brand i{{color:var(--orange);font-style:normal}}.navlinks{{display:flex;align-items:center;gap:20px}}.navlinks a,.lang{{font-size:14px;color:var(--ink);text-decoration:none;background:transparent;border:0;cursor:pointer}}.login{{padding:11px 16px;border:1px solid var(--pine)!important;border-radius:10px;font-weight:700}}.hero{{padding:76px 0 54px;display:grid;grid-template-columns:1.2fr .8fr;gap:35px;align-items:center}}.eyebrow{{letter-spacing:1.6px;text-transform:uppercase;font-size:12px;font-weight:800;color:var(--orange)}}h1{{font-family:Georgia,serif;font-size:clamp(46px,6vw,78px);line-height:.96;letter-spacing:-3px;margin:18px 0 23px;max-width:760px}}.lead{{font-size:19px;line-height:1.6;color:var(--muted);max-width:650px}}.actions{{display:flex;gap:12px;margin-top:29px;flex-wrap:wrap}}.primary,.ghost{{padding:15px 20px;border-radius:10px;border:0;font-weight:800;cursor:pointer}}.primary{{background:var(--orange);color:#fff;box-shadow:0 12px 24px #ff6c3733}}.ghost{{background:#fff;border:1px solid var(--line);color:var(--pine)}}.hero-panel{{background:var(--pine);color:#fff;padding:29px;border-radius:22px;min-height:290px;display:flex;flex-direction:column;justify-content:space-between}}.hero-panel h2{{font-family:Georgia,serif;font-size:30px;line-height:1.05;margin:0;max-width:300px}}.live{{display:flex;gap:9px;align-items:center;font-size:13px}}.dot{{height:10px;width:10px;border-radius:50%;background:var(--lime);box-shadow:0 0 0 5px #b8eea733}}.stats{{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}}.stat{{background:#ffffff15;border:1px solid #ffffff25;border-radius:12px;padding:12px}}.stat b{{font-size:19px;display:block}}.stat span{{font-size:11px;color:#d5e4dd}}.section-title{{display:flex;align-items:end;justify-content:space-between;gap:20px;margin:23px 0}}.section-title h2{{font-family:Georgia,serif;font-size:40px;letter-spacing:-1.5px;margin:6px 0 0}}.grid{{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding-bottom:62px}}.module-card{{min-height:238px;text-align:left;background:#fff;border:1px solid var(--line);border-radius:18px;padding:22px;display:flex;flex-direction:column;gap:11px;cursor:pointer;transition:.2s;color:var(--ink)}}.module-card:hover{{transform:translateY(-4px);box-shadow:0 18px 34px #092c2612;border-color:#92b8a9}}.module-card strong{{font-size:20px}}.module-card b{{font-size:14px}}.module-card small{{color:var(--muted);font-size:13px;line-height:1.45}}.module-icon{{font-size:25px}}.status{{margin-left:auto;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;padding:6px 8px;border-radius:99px;background:#f5f1e9;color:#896f42}}.status.aktivno{{background:var(--mint);color:#18704f}}.arrow{{margin-top:auto;font-size:13px;font-weight:800;color:var(--orange)}}.how{{background:var(--mint);padding:55px 0}}.steps{{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}}.step{{padding:8px 16px 8px 0}}.step em{{font-style:normal;color:var(--orange);font-weight:900;font-size:14px}}.step h3{{margin:8px 0;font-size:19px}}.step p{{font-size:14px;color:var(--muted);line-height:1.5}}footer{{padding:30px 0;color:var(--muted);font-size:13px;display:flex;justify-content:space-between}}dialog{{border:0;border-radius:18px;padding:0;width:min(460px,calc(100% - 32px));box-shadow:0 25px 75px #0004}}dialog::backdrop{{background:#092c2666}}.dialog-inner{{padding:30px}}.dialog-inner h3{{font-family:Georgia,serif;font-size:30px;margin:0 0 10px}}.dialog-inner p{{color:var(--muted);line-height:1.5}}input{{width:100%;padding:14px;border:1px solid var(--line);border-radius:9px;margin:12px 0;font:inherit}}.close{{float:right;border:0;background:transparent;font-size:22px;cursor:pointer;color:var(--ink)}}@media(max-width:820px){{.navlinks a:not(.login){{display:none}}.hero{{grid-template-columns:1fr;padding-top:46px}}.grid{{grid-template-columns:1fr 1fr}}.steps{{grid-template-columns:1fr}}}}@media(max-width:520px){{.wrap{{padding:0 18px}}h1{{letter-spacing:-2px}}.grid{{grid-template-columns:1fr}}.stats{{grid-template-columns:1fr 1fr}}footer{{display:block;line-height:2}}}}
</style></head><body><div class="wrap"><nav><a class="brand" href="/">balkan<i>.</i>works</a><div class="navlinks"><a href="#moduli">Moduli</a><a href="#kako-radi">Kako radi</a><button class="lang" id="language">{language} ▾</button><button class="login" data-open="account">Prijavi se</button></div></nav><main><section class="hero"><div><div class="eyebrow">Jedan nalog · ceo Balkan</div><h1>Sve što ti treba. Lokalno.</h1><p class="lead">Balkan.works povezuje ljude, male biznise, usluge i dobre ponude u jednu sigurnu digitalnu platformu.</p><div class="actions"><button class="primary" data-open="account">Napravi besplatan nalog</button><button class="ghost" onclick="document.getElementById('moduli').scrollIntoView({{behavior:'smooth'}})">Istraži module</button></div></div><aside class="hero-panel"><div><div class="live"><span class="dot"></span>{core_label}</div><h2>Platforma koja raste sa tobom.</h2></div><div class="stats"><div class="stat"><b>6</b><span>jezika od početka</span></div><div class="stat"><b>5</b><span>modula u ekosistemu</span></div><div class="stat"><b>1</b><span>centralni nalog</span></div></div></aside></section><section id="moduli"><div class="section-title"><div><div class="eyebrow">Ekosistem</div><h2>Izaberi gde počinješ.</h2></div><span class="status aktivno">Core online</span></div><div class="grid">{cards}</div></section></main></div><section class="how" id="kako-radi"><div class="wrap"><div class="eyebrow">Jedinstven sistem</div><h2 style="font-family:Georgia,serif;font-size:40px;letter-spacing:-1.5px;margin:7px 0 25px">Jedan nalog. Više mogućnosti.</h2><div class="steps"><div class="step"><em>01</em><h3>Otvori profil</h3><p>Izaberi jezik, grad i ono što te zanima. Tvoj nalog važi za svaki Balkan.works modul.</p></div><div class="step"><em>02</em><h3>Pronađi lokalno</h3><p>Usluge, firme i ponude nalaze se prema tvojoj lokaciji i potrebama.</p></div><div class="step"><em>03</em><h3>Gradi poverenje</h3><p>Verifikovani profili, ocene i jasna pravila čine platformu sigurnijom za sve.</p></div></div></div></section><div class="wrap"><footer><span>© 2026 Balkan.works</span><span>Regionalna platforma za ljude i lokalne biznise.</span></footer></div><dialog id="account"><div class="dialog-inner"><button class="close" aria-label="Zatvori">×</button><div class="eyebrow">Balkan.works nalog</div><h3>Pridruži se platformi.</h3><p>Prijava i registracija se sada vezuju na Balkan.works Core. Ostavi email da nastavimo sa tobom u sledećem koraku.</p><input id="email" type="email" placeholder="tvoj@email.com"><button class="primary" id="continue">Nastavi →</button><p id="notice" hidden></p></div></dialog><script>const dialog=document.getElementById('account');document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>dialog.showModal());document.querySelector('.close').onclick=()=>dialog.close();document.querySelectorAll('.module-card').forEach(c=>c.onclick=()=>{{document.querySelector('.dialog-inner h3').textContent=c.dataset.title+' dolazi uskoro';document.querySelector('.dialog-inner p').textContent='Ovaj modul je spreman u ekosistemu. Prijavi se da dobiješ obaveštenje kada se otvori u tvom gradu.';dialog.showModal()}});document.getElementById('continue').onclick=()=>{{const e=document.getElementById('email');const n=document.getElementById('notice');if(!e.checkValidity()){{e.reportValidity();return}}n.hidden=false;n.textContent='Hvala — tvoj interes je zabeležen. Prava registracija je sledeći povezani korak.';n.style.color='#18704f'}};document.getElementById('language').onclick=()=>{{const values=['SR','HR','BS','MK','EN','DE'];const current=location.search.match(/lang=([A-Z]+)/)?.[1]||'SR';location.search='?lang='+values[(values.indexOf(current)+1)%values.length]}};</script></body></html>'''


def icon(key: str) -> str:
    return {"work": "⌁", "deals": "◈", "food": "◌", "business": "▦", "money": "⌘"}[key]


@app.get("/", response_class=HTMLResponse, include_in_schema=False)
async def home(lang: str = Query("SR")) -> HTMLResponse:
    return HTMLResponse(page(lang.upper(), await core_status()))


@app.get("/health", response_class=JSONResponse, include_in_schema=False)
async def health() -> JSONResponse:
    return JSONResponse({"status": "ok", "service": "balkan-portal", "core_api": await core_status()})

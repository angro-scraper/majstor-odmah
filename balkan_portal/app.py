"""Balkan.works public super-app portal (independent Python web service)."""
from __future__ import annotations

import os
from html import escape

import httpx
from fastapi import FastAPI, HTTPException, Query, Request, status
from pydantic import BaseModel, EmailStr, Field
from fastapi.responses import HTMLResponse, JSONResponse
from admin_page import render_admin_page
from business_page import render_business_page
from dashboard_page import render_dashboard_page
from modules_page import render_module_page
from search_page import render_search_page
from hub_page import render_hub_page

APP_NAME = "Balkan.works"
CORE_URL = os.getenv("CORE_API_URL", "https://balkan-works-core.onrender.com").rstrip("/")

app = FastAPI(title="Balkan.works Portal", docs_url=None, redoc_url=None)

MODULES = [
    ("work", "Balkan.Works", "Poslovi, majstori i lokalne usluge", "Pronađi proverene ljude i firme u svom gradu.", "Aktivno", "/market"),
    ("deals", "Deals", "Akcije i digitalni flajeri", "Ponude iz prodavnica koje pratiš, bez papirnih flajera.", "Aktivno", "/deals"),
    ("food", "Save Food", "Sačuvaj dobru hranu", "Rezerviši pakete viška hrane u blizini.", "Aktivno", "/save-food"),
    ("business", "Business", "Alati za firme", "Ponude, profil firme i alati za svakodnevni posao.", "Aktivno", "/business"),
    ("money", "Money", "Pametnije sa novcem", "Budžet, edukacija i finansijski alati za kasnije.", "Planirano", "/account"),
]


class PortalRegistration(BaseModel):
    display_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=10, max_length=128)
    preferred_locale: str = Field(default="sr", min_length=2, max_length=8)


class PortalLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


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
        f'''<a href="{url}" class="module-card {key}" data-module="{key}" data-title="{escape(title)}">
              <span class="module-icon">{icon(key)}</span><span class="status {badge.lower()}">{badge}</span>
              <strong>{escape(title)}</strong><b>{escape(subtitle)}</b><small>{escape(description)}</small>
              <span class="arrow">Otvori →</span></a>'''
        for key, title, subtitle, description, badge, url in MODULES
    )
    core_label = "Core je povezan" if status == "online" else "Proveravamo Core"
    return f'''<!doctype html><html lang="{language.lower()}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{APP_NAME} — sve lokalno, na jednom mestu</title><style>
:root{{--ink:#092c26;--pine:#0d4036;--mint:#e5f5eb;--lime:#b8eea7;--paper:#fbfaf6;--orange:#ff6c37;--muted:#62746e;--line:#d9e3dc}}*{{box-sizing:border-box}}body{{margin:0;background:var(--paper);color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,sans-serif}}button{{font:inherit}}.wrap{{max-width:1200px;margin:auto;padding:0 28px}}nav{{height:78px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line)}}.brand{{font-weight:900;font-size:24px;letter-spacing:-1.1px;text-decoration:none;color:var(--ink)}}.brand i{{color:var(--orange);font-style:normal}}.navlinks{{display:flex;align-items:center;gap:20px}}.navlinks a,.lang{{font-size:14px;color:var(--ink);text-decoration:none;background:transparent;border:0;cursor:pointer}}.login{{padding:11px 16px;border:1px solid var(--pine)!important;border-radius:10px;font-weight:700}}.hero{{padding:76px 0 54px;display:grid;grid-template-columns:1.2fr .8fr;gap:35px;align-items:center}}.eyebrow{{letter-spacing:1.6px;text-transform:uppercase;font-size:12px;font-weight:800;color:var(--orange)}}h1{{font-family:Georgia,serif;font-size:clamp(46px,6vw,78px);line-height:.96;letter-spacing:-3px;margin:18px 0 23px;max-width:760px}}.lead{{font-size:19px;line-height:1.6;color:var(--muted);max-width:650px}}.actions{{display:flex;gap:12px;margin-top:29px;flex-wrap:wrap}}.primary,.ghost{{padding:15px 20px;border-radius:10px;border:0;font-weight:800;cursor:pointer}}.primary{{background:var(--orange);color:#fff;box-shadow:0 12px 24px #ff6c3733}}.ghost{{background:#fff;border:1px solid var(--line);color:var(--pine)}}.hero-panel{{background:var(--pine);color:#fff;padding:29px;border-radius:22px;min-height:290px;display:flex;flex-direction:column;justify-content:space-between}}.hero-panel h2{{font-family:Georgia,serif;font-size:30px;line-height:1.05;margin:0;max-width:300px}}.live{{display:flex;gap:9px;align-items:center;font-size:13px}}.dot{{height:10px;width:10px;border-radius:50%;background:var(--lime);box-shadow:0 0 0 5px #b8eea733}}.stats{{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}}.stat{{background:#ffffff15;border:1px solid #ffffff25;border-radius:12px;padding:12px}}.stat b{{font-size:19px;display:block}}.stat span{{font-size:11px;color:#d5e4dd}}.section-title{{display:flex;align-items:end;justify-content:space-between;gap:20px;margin:23px 0}}.section-title h2{{font-family:Georgia,serif;font-size:40px;letter-spacing:-1.5px;margin:6px 0 0}}.grid{{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding-bottom:62px}}.module-card{{min-height:238px;text-align:left;text-decoration:none;background:#fff;border:1px solid var(--line);border-radius:18px;padding:22px;display:flex;flex-direction:column;gap:11px;cursor:pointer;transition:.2s;color:var(--ink)}}.module-card:hover{{transform:translateY(-4px);box-shadow:0 18px 34px #092c2612;border-color:#92b8a9}}.module-card strong{{font-size:20px}}.module-card b{{font-size:14px}}.module-card small{{color:var(--muted);font-size:13px;line-height:1.45}}.module-icon{{font-size:25px}}.status{{margin-left:auto;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;padding:6px 8px;border-radius:99px;background:#f5f1e9;color:#896f42}}.status.aktivno{{background:var(--mint);color:#18704f}}.arrow{{margin-top:auto;font-size:13px;font-weight:800;color:var(--orange)}}.how{{background:var(--mint);padding:55px 0}}.steps{{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}}.step{{padding:8px 16px 8px 0}}.step em{{font-style:normal;color:var(--orange);font-weight:900;font-size:14px}}.step h3{{margin:8px 0;font-size:19px}}.step p{{font-size:14px;color:var(--muted);line-height:1.5}}footer{{padding:30px 0;color:var(--muted);font-size:13px;display:flex;justify-content:space-between}}dialog{{border:0;border-radius:18px;padding:0;width:min(460px,calc(100% - 32px));box-shadow:0 25px 75px #0004}}dialog::backdrop{{background:#092c2666}}.dialog-inner{{padding:30px}}.dialog-inner h3{{font-family:Georgia,serif;font-size:30px;margin:0 0 10px}}.dialog-inner p{{color:var(--muted);line-height:1.5}}input{{width:100%;padding:14px;border:1px solid var(--line);border-radius:9px;margin:12px 0;font:inherit}}.close{{float:right;border:0;background:transparent;font-size:22px;cursor:pointer;color:var(--ink)}}@media(max-width:820px){{.navlinks a:not(.login){{display:none}}.hero{{grid-template-columns:1fr;padding-top:46px}}.grid{{grid-template-columns:1fr 1fr}}.steps{{grid-template-columns:1fr}}}}@media(max-width:520px){{.wrap{{padding:0 18px}}h1{{letter-spacing:-2px}}.grid{{grid-template-columns:1fr}}.stats{{grid-template-columns:1fr 1fr}}footer{{display:block;line-height:2}}}}
</style></head><body><div class="wrap"><nav><a class="brand" href="/">balkan<i>.</i>works</a><div class="navlinks"><a href="#moduli">Moduli</a><a href="#kako-radi">Kako radi</a><button class="lang" id="language">{language} ▾</button><button class="login" data-open="account">Prijavi se</button></div></nav><main><section class="hero"><div><div class="eyebrow">Jedan nalog · ceo Balkan</div><h1>Sve što ti treba. Lokalno.</h1><p class="lead">Balkan.works povezuje ljude, male biznise, usluge i dobre ponude u jednu sigurnu digitalnu platformu.</p><div class="actions"><button class="primary" data-open="account">Napravi besplatan nalog</button><button class="ghost" onclick="document.getElementById('moduli').scrollIntoView({{behavior:'smooth'}})">Istraži module</button></div></div><aside class="hero-panel"><div><div class="live"><span class="dot"></span>{core_label}</div><h2>Platforma koja raste sa tobom.</h2></div><div class="stats"><div class="stat"><b>6</b><span>jezika od početka</span></div><div class="stat"><b>5</b><span>modula u ekosistemu</span></div><div class="stat"><b>1</b><span>centralni nalog</span></div></div></aside></section><section id="moduli"><div class="section-title"><div><div class="eyebrow">Ekosistem</div><h2>Izaberi gde počinješ.</h2></div><span class="status aktivno">Core online</span></div><div class="grid">{cards}</div></section></main></div><section class="how" id="kako-radi"><div class="wrap"><div class="eyebrow">Jedinstven sistem</div><h2 style="font-family:Georgia,serif;font-size:40px;letter-spacing:-1.5px;margin:7px 0 25px">Jedan nalog. Više mogućnosti.</h2><div class="steps"><div class="step"><em>01</em><h3>Otvori profil</h3><p>Izaberi jezik, grad i ono što te zanima. Tvoj nalog važi za svaki Balkan.works modul.</p></div><div class="step"><em>02</em><h3>Pronađi lokalno</h3><p>Usluge, firme i ponude nalaze se prema tvojoj lokaciji i potrebama.</p></div><div class="step"><em>03</em><h3>Gradi poverenje</h3><p>Verifikovani profili, ocene i jasna pravila čine platformu sigurnijom za sve.</p></div></div></div></section><div class="wrap"><footer><span>© 2026 Balkan.works</span><span>Regionalna platforma za ljude i lokalne biznise.</span></footer></div><dialog id="account"><div class="dialog-inner"><button class="close" aria-label="Zatvori">×</button><div class="eyebrow">Balkan.works nalog</div><h3>Pridruži se platformi.</h3><p>Otvori jedan nalog koji će važiti za sve module platforme.</p><input id="display-name" placeholder="Ime i prezime" autocomplete="name"><input id="email" type="email" placeholder="tvoj@email.com" autocomplete="email"><input id="password" type="password" placeholder="Lozinka (najmanje 10 karaktera)" autocomplete="new-password"><button class="primary" id="continue">Napravi nalog →</button><p id="notice" hidden></p></div></dialog><script>const dialog=document.getElementById('account');document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>dialog.showModal());document.querySelector('.close').onclick=()=>dialog.close();document.querySelectorAll('.module-card').forEach(c=>c.onclick=()=>{{document.querySelector('.dialog-inner h3').textContent=c.dataset.title+' dolazi uskoro';document.querySelector('.dialog-inner p').textContent='Ovaj modul je spreman u ekosistemu. Napravi nalog da dobiješ obaveštenje kada se otvori u tvom gradu.';dialog.showModal()}});document.getElementById('continue').onclick=async()=>{{const name=document.getElementById('display-name'),email=document.getElementById('email'),password=document.getElementById('password'),notice=document.getElementById('notice');if(!name.value.trim()||!email.checkValidity()||password.value.length<10){{notice.hidden=false;notice.style.color='#b94527';notice.textContent='Unesi ime, validan email i lozinku od najmanje 10 karaktera.';return}}const button=document.getElementById('continue');button.disabled=true;button.textContent='Kreiramo…';try{{const response=await fetch('/api/register',{{method:'POST',headers:{{'content-type':'application/json'}},body:JSON.stringify({{display_name:name.value.trim(),email:email.value,password:password.value,preferred_locale:'{language.lower()}'}})}});const data=await response.json();if(!response.ok)throw new Error(data.detail||'Registracija nije uspela.');localStorage.setItem('balkan_access_token',data.access_token);notice.style.color='#18704f';notice.textContent='Nalog je napravljen. Dobro došao/la na Balkan.works!'}}catch(error){{notice.style.color='#b94527';notice.textContent=error.message}}finally{{notice.hidden=false;button.disabled=false;button.textContent='Napravi nalog →'}}}};document.getElementById('language').onclick=()=>{{const values=['SR','HR','BS','MK','EN','DE'];const current=location.search.match(/lang=([A-Z]+)/)?.[1]||'SR';location.search='?lang='+values[(values.indexOf(current)+1)%values.length]}};</script></body></html>'''


def icon(key: str) -> str:
    return {"work": "⌁", "deals": "◈", "food": "◌", "business": "▦", "money": "⌘"}[key]


@app.get("/", response_class=HTMLResponse, include_in_schema=False)
async def home(lang: str = Query("SR")) -> HTMLResponse:
    return HTMLResponse(page(lang.upper(), await core_status()))


@app.get("/health", response_class=JSONResponse, include_in_schema=False)
async def health() -> JSONResponse:
    return JSONResponse({"status": "ok", "service": "balkan-portal", "core_api": await core_status()})


@app.post("/api/register", response_class=JSONResponse, include_in_schema=False)
async def register(payload: PortalRegistration) -> JSONResponse:
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(f"{CORE_URL}/api/auth/register", json=payload.model_dump())
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Core servis trenutno nije dostupan.") from exc
    if response.is_error:
        detail = response.json().get("detail", "Registracija nije uspela.")
        raise HTTPException(status_code=response.status_code, detail=detail)
    return JSONResponse(response.json(), status_code=status.HTTP_201_CREATED)


@app.post("/api/login", response_class=JSONResponse, include_in_schema=False)
async def login(payload: PortalLogin) -> JSONResponse:
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(f"{CORE_URL}/api/auth/login", json=payload.model_dump())
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Core servis trenutno nije dostupan.") from exc
    if response.is_error:
        raise HTTPException(status_code=response.status_code, detail=response.json().get("detail", "Prijava nije uspela."))
    return JSONResponse(response.json())


async def core_profile(request: Request, method: str, payload: dict | None = None) -> JSONResponse:
    authorization = request.headers.get("authorization")
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Prijava je obavezna.")
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.request(method, f"{CORE_URL}/api/users/me", headers={"Authorization": authorization}, json=payload)
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Core servis trenutno nije dostupan.") from exc
    if response.is_error:
        raise HTTPException(status_code=response.status_code, detail=response.json().get("detail", "Profil nije dostupan."))
    return JSONResponse(response.json())


@app.get("/api/me", response_class=JSONResponse, include_in_schema=False)
async def me(request: Request) -> JSONResponse:
    return await core_profile(request, "GET")


@app.patch("/api/me", response_class=JSONResponse, include_in_schema=False)
async def update_me(request: Request, payload: dict) -> JSONResponse:
    return await core_profile(request, "PATCH", payload)


async def core_business(request: Request, method: str, payload: dict | None = None) -> JSONResponse:
    authorization = request.headers.get("authorization")
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Prijava je obavezna.")
    try:
        async with httpx.AsyncClient(timeout=12) as client:
            response = await client.request(method, f"{CORE_URL}/api/business/mine" if method == "GET" else f"{CORE_URL}/api/business", headers={"Authorization": authorization}, json=payload)
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=503, detail="Business servis trenutno nije dostupan.") from exc
    if response.is_error:
        raise HTTPException(status_code=response.status_code, detail=response.json().get("detail", "Firma nije sačuvana."))
    return JSONResponse(response.json(), status_code=response.status_code)


@app.get("/api/businesses", response_class=JSONResponse, include_in_schema=False)
async def my_businesses(request: Request) -> JSONResponse:
    return await core_business(request, "GET")


@app.post("/api/businesses", response_class=JSONResponse, include_in_schema=False)
async def create_business(request: Request, payload: dict) -> JSONResponse:
    return await core_business(request, "POST", payload)


async def core_module(
    request: Request, upstream_path: str, method: str = "GET", payload: dict | None = None, require_auth: bool = False
) -> JSONResponse:
    """Proxy public module reads and authenticated module actions to Core."""
    authorization = request.headers.get("authorization")
    if require_auth and not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Prijava je obavezna.")
    headers = {"Authorization": authorization} if authorization else {}
    if request.url.query:
        upstream_path = f"{upstream_path}?{request.url.query}"
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.request(method, f"{CORE_URL}{upstream_path}", headers=headers, json=payload)
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=503, detail="Platforma je trenutno nedostupna.") from exc
    if response.is_error:
        try:
            detail = response.json().get("detail", "Zahtev nije uspeo.")
        except ValueError:
            detail = "Zahtev nije uspeo."
        raise HTTPException(status_code=response.status_code, detail=detail)
    return JSONResponse(response.json(), status_code=response.status_code)


@app.get("/api/locations/countries", response_class=JSONResponse, include_in_schema=False)
async def location_countries(request: Request) -> JSONResponse:
    return await core_module(request, "/api/locations/countries")


@app.get("/api/locations/cities", response_class=JSONResponse, include_in_schema=False)
async def location_cities(request: Request) -> JSONResponse:
    return await core_module(request, "/api/locations/cities")


@app.get("/api/locations/nearby-cities", response_class=JSONResponse, include_in_schema=False)
async def location_nearby_cities(request: Request) -> JSONResponse:
    return await core_module(request, "/api/locations/nearby-cities")


@app.get("/api/search", response_class=JSONResponse, include_in_schema=False)
async def universal_search(request: Request) -> JSONResponse:
    return await core_module(request, "/api/discovery/search")


@app.get("/api/super-app/hub", response_class=JSONResponse, include_in_schema=False)
async def super_app_hub(request: Request) -> JSONResponse:
    return await core_module(request, "/api/super-app/hub", require_auth=True)


@app.get("/api/market/listings", response_class=JSONResponse, include_in_schema=False)
async def market_listings(request: Request) -> JSONResponse:
    return await core_module(request, "/api/marketplace/listings")


@app.post("/api/market/listings", response_class=JSONResponse, include_in_schema=False)
async def market_create_listing(request: Request, payload: dict) -> JSONResponse:
    return await core_module(request, "/api/marketplace/listings", "POST", payload, require_auth=True)


@app.get("/api/deals/offers", response_class=JSONResponse, include_in_schema=False)
async def deals_offers(request: Request) -> JSONResponse:
    return await core_module(request, "/api/offers")


@app.post("/api/deals/offers", response_class=JSONResponse, include_in_schema=False)
async def deals_create_offer(request: Request, payload: dict) -> JSONResponse:
    return await core_module(request, "/api/offers", "POST", payload, require_auth=True)


@app.get("/api/food/packages", response_class=JSONResponse, include_in_schema=False)
async def food_packages(request: Request) -> JSONResponse:
    return await core_module(request, "/api/save-food/packages")


@app.post("/api/food/packages", response_class=JSONResponse, include_in_schema=False)
async def food_create_package(request: Request, payload: dict) -> JSONResponse:
    return await core_module(request, "/api/save-food/packages", "POST", payload, require_auth=True)


@app.post("/api/food/packages/{package_id}/reserve", response_class=JSONResponse, include_in_schema=False)
async def food_reserve(package_id: str, request: Request, payload: dict) -> JSONResponse:
    return await core_module(request, f"/api/save-food/packages/{package_id}/reserve", "POST", payload, require_auth=True)


@app.get("/api/market/favorites", response_class=JSONResponse, include_in_schema=False)
async def market_favorites(request: Request) -> JSONResponse:
    return await core_module(request, "/api/marketplace/favorites", require_auth=True)


@app.get("/api/market/messages", response_class=JSONResponse, include_in_schema=False)
async def market_messages(request: Request) -> JSONResponse:
    return await core_module(request, "/api/marketplace/messages", require_auth=True)


@app.post("/api/market/listings/{listing_id}/favorite", response_class=JSONResponse, include_in_schema=False)
async def market_favorite(listing_id: str, request: Request) -> JSONResponse:
    return await core_module(request, f"/api/marketplace/listings/{listing_id}/favorite", "POST", require_auth=True)


@app.post("/api/market/messages", response_class=JSONResponse, include_in_schema=False)
async def market_send_message(request: Request, payload: dict) -> JSONResponse:
    return await core_module(request, "/api/marketplace/messages", "POST", payload, require_auth=True)


@app.get("/api/notifications", response_class=JSONResponse, include_in_schema=False)
async def notifications(request: Request) -> JSONResponse:
    return await core_module(request, "/api/notifications", require_auth=True)


@app.post("/api/notifications/read-all", response_class=JSONResponse, include_in_schema=False)
async def notifications_read_all(request: Request) -> JSONResponse:
    return await core_module(request, "/api/notifications/read-all", "POST", require_auth=True)


@app.get("/api/payments/wallet", response_class=JSONResponse, include_in_schema=False)
async def payments_wallet(request: Request) -> JSONResponse:
    return await core_module(request, "/api/payments/wallet", require_auth=True)


async def core_admin(request: Request, path: str, method: str = "GET") -> JSONResponse:
    authorization = request.headers.get("authorization")
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Prijava je obavezna.")
    try:
        async with httpx.AsyncClient(timeout=12) as client:
            response = await client.request(method, f"{CORE_URL}/api/admin/{path}", headers={"Authorization": authorization})
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=503, detail="Admin Core servis trenutno nije dostupan.") from exc
    if response.is_error:
        try:
            detail = response.json().get("detail", "Admin zahtev nije uspeo.")
        except ValueError:
            detail = "Admin zahtev nije uspeo."
        raise HTTPException(status_code=response.status_code, detail=detail)
    return JSONResponse(response.json(), status_code=response.status_code)


@app.get("/api/admin/dashboard", response_class=JSONResponse, include_in_schema=False)
async def admin_dashboard(request: Request) -> JSONResponse:
    return await core_admin(request, "dashboard")


@app.get("/api/admin/users", response_class=JSONResponse, include_in_schema=False)
async def admin_users(request: Request) -> JSONResponse:
    return await core_admin(request, "users")


@app.post("/api/admin/users/{user_id}/block", response_class=JSONResponse, include_in_schema=False)
async def admin_block_user(user_id: str, request: Request) -> JSONResponse:
    return await core_admin(request, f"users/{user_id}/block", "POST")


@app.get("/api/admin/businesses", response_class=JSONResponse, include_in_schema=False)
async def admin_businesses(request: Request) -> JSONResponse:
    return await core_admin(request, "businesses")


@app.post("/api/admin/businesses/{business_id}/verify", response_class=JSONResponse, include_in_schema=False)
async def admin_verify_business(business_id: str, request: Request) -> JSONResponse:
    return await core_admin(request, f"businesses/{business_id}/verify", "POST")


@app.get("/api/admin/listings", response_class=JSONResponse, include_in_schema=False)
async def admin_listings(request: Request) -> JSONResponse:
    return await core_admin(request, "listings")


@app.post("/api/admin/listings/{listing_id}/hide", response_class=JSONResponse, include_in_schema=False)
async def admin_hide_listing(listing_id: str, request: Request) -> JSONResponse:
    return await core_admin(request, f"listings/{listing_id}/hide", "POST")


@app.get("/api/admin/audit-logs", response_class=JSONResponse, include_in_schema=False)
async def admin_audit_logs(request: Request) -> JSONResponse:
    return await core_admin(request, "audit-logs")


@app.get("/business", response_class=HTMLResponse, include_in_schema=False)
async def business() -> HTMLResponse:
    return render_business_page()


@app.get("/dashboard", response_class=HTMLResponse, include_in_schema=False)
async def dashboard() -> HTMLResponse:
    return HTMLResponse(render_dashboard_page())


@app.get("/search", response_class=HTMLResponse, include_in_schema=False)
async def search() -> HTMLResponse:
    return HTMLResponse(render_search_page())


@app.get("/hub", response_class=HTMLResponse, include_in_schema=False)
async def hub() -> HTMLResponse:
    return HTMLResponse(render_hub_page())


@app.get("/market", response_class=HTMLResponse, include_in_schema=False)
async def market() -> HTMLResponse:
    return HTMLResponse(render_module_page("market"))


@app.get("/deals", response_class=HTMLResponse, include_in_schema=False)
async def deals() -> HTMLResponse:
    return HTMLResponse(render_module_page("deals"))


@app.get("/save-food", response_class=HTMLResponse, include_in_schema=False)
async def save_food() -> HTMLResponse:
    return HTMLResponse(render_module_page("food"))


@app.get("/admin", response_class=HTMLResponse, include_in_schema=False)
async def admin() -> HTMLResponse:
    return HTMLResponse(render_admin_page())


@app.get("/account", response_class=HTMLResponse, include_in_schema=False)
async def account() -> HTMLResponse:
    return HTMLResponse('''<!doctype html><html lang="sr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Moj nalog · Balkan.works</title><style>:root{--ink:#092c26;--pine:#0d4036;--paper:#fbfaf6;--orange:#ff6c37;--line:#d9e3dc;--muted:#62746e}*{box-sizing:border-box}body{margin:0;background:var(--paper);font-family:Inter,system-ui,sans-serif;color:var(--ink)}main{max-width:860px;margin:0 auto;padding:48px 20px}.brand{font-weight:900;font-size:24px;color:var(--ink);text-decoration:none}.brand i{color:var(--orange)}.card{background:#fff;border:1px solid var(--line);border-radius:18px;padding:28px;margin-top:28px;max-width:620px}h1{font-family:Georgia,serif;font-size:46px;letter-spacing:-1.6px;margin:8px 0}.eyebrow{font-size:12px;color:var(--orange);letter-spacing:1.4px;font-weight:800;text-transform:uppercase}p{color:var(--muted);line-height:1.5}input{width:100%;padding:13px;margin:7px 0;border:1px solid var(--line);border-radius:9px;font:inherit}button{padding:12px 16px;border:0;border-radius:9px;background:var(--orange);color:#fff;font-weight:800;cursor:pointer;margin-top:10px}.secondary{background:#fff;color:var(--pine);border:1px solid var(--pine);margin-left:8px}.hidden{display:none}.field{margin-top:15px}.status{margin-top:15px;font-size:14px}</style><main><a class="brand" href="/">balkan<i>.</i>works</a><section id="login-card" class="card"><div class="eyebrow">Prijava</div><h1>Dobro došao/la.</h1><p>Prijavi se jednim nalogom za sve Balkan.works module.</p><input id="login-email" type="email" placeholder="Email"><input id="login-password" type="password" placeholder="Lozinka"><button id="login">Prijavi se</button><p class="status" id="login-status"></p></section><section id="profile-card" class="card hidden"><div class="eyebrow">Moj Balkan.works nalog</div><h1 id="name">Profil</h1><p id="summary"></p><div class="field"><label>Ime i prezime<input id="display-name"></label></div><div class="field"><label>Država (npr. RS)<input id="country"></label></div><div class="field"><label>Grad<input id="city"></label></div><div class="field"><label>Jezik<input id="locale"></label></div><button id="save">Sačuvaj profil</button><button class="secondary" id="logout">Odjavi se</button><p class="status" id="profile-status"></p></section></main><script>const token=()=>localStorage.getItem('balkan_access_token');const headers=()=>({'content-type':'application/json','authorization':'Bearer '+token()});async function load(){if(!token())return;const r=await fetch('/api/me',{headers:headers()});if(!r.ok){localStorage.removeItem('balkan_access_token');return}const d=await r.json(),p=d.profile,u=d.user;document.querySelector('#login-card').classList.add('hidden');document.querySelector('#profile-card').classList.remove('hidden');document.querySelector('#name').textContent=p.display_name;document.querySelector('#summary').textContent=u.email+' · '+u.role;document.querySelector('#display-name').value=p.display_name||'';document.querySelector('#country').value=p.country_code||'';document.querySelector('#city').value=p.city_name||'';document.querySelector('#locale').value=p.preferred_locale||'sr'}document.querySelector('#login').onclick=async()=>{const r=await fetch('/api/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:document.querySelector('#login-email').value,password:document.querySelector('#login-password').value})}),d=await r.json();if(!r.ok){document.querySelector('#login-status').textContent=d.detail||'Prijava nije uspela.';return}localStorage.setItem('balkan_access_token',d.access_token);load()};document.querySelector('#save').onclick=async()=>{const r=await fetch('/api/me',{method:'PATCH',headers:headers(),body:JSON.stringify({display_name:document.querySelector('#display-name').value,country_code:document.querySelector('#country').value||null,city_name:document.querySelector('#city').value||null,preferred_locale:document.querySelector('#locale').value})}),d=await r.json();document.querySelector('#profile-status').textContent=r.ok?'Profil je sačuvan.':(d.detail||'Izmena nije uspela.');if(r.ok)load()};document.querySelector('#logout').onclick=()=>{localStorage.removeItem('balkan_access_token');location.reload()};load()</script></html>''')


@app.get("/business-legacy", response_class=HTMLResponse, include_in_schema=False)
async def business_panel() -> HTMLResponse:
    return HTMLResponse('''<!doctype html><html lang="sr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Business · Balkan.works</title><style>body{margin:0;background:#fbfaf6;color:#092c26;font-family:Inter,system-ui}main{max-width:920px;margin:auto;padding:42px 20px}.brand{font-size:24px;font-weight:900;color:#092c26;text-decoration:none}.brand i{color:#ff6c37}h1{font:46px Georgia,serif;margin:16px 0 8px}.card{background:#fff;border:1px solid #d9e3dc;border-radius:18px;padding:25px;margin-top:23px;max-width:700px}.eyebrow{color:#ff6c37;font-size:12px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase}p{color:#62746e}input,textarea{display:block;width:100%;padding:12px;border:1px solid #d9e3dc;border-radius:8px;margin:8px 0;font:inherit}button{padding:12px 16px;background:#ff6c37;color:#fff;border:0;border-radius:8px;font-weight:800;cursor:pointer}.business{border-top:1px solid #d9e3dc;padding:15px 0}.hidden{display:none}</style><main><a class="brand" href="/">balkan<i>.</i>works</a><section class="card" id="locked"><div class="eyebrow">Business</div><h1>Vodi svoju firmu.</h1><p>Prvo se prijavi preko <a href="/account">svog naloga</a>, pa se vrati ovde.</p></section><section id="panel" class="hidden"><div class="eyebrow">Business engine</div><h1>Moje firme</h1><section class="card"><h2>Dodaj firmu</h2><input id="name" placeholder="Naziv firme"><input id="country" placeholder="Država (RS)"><input id="city" placeholder="Grad"><input id="address" placeholder="Adresa"><input id="tax" placeholder="PIB (opciono)"><textarea id="description" placeholder="Kratak opis firme"></textarea><button id="create">Sačuvaj firmu</button><p id="status"></p></section><section class="card" id="list"></section></section></main><script>const t=localStorage.getItem('balkan_access_token'),h={'content-type':'application/json','authorization':'Bearer '+t};async function load(){if(!t)return;document.querySelector('#locked').classList.add('hidden');document.querySelector('#panel').classList.remove('hidden');const r=await fetch('/api/businesses',{headers:h});if(!r.ok)return;const d=await r.json();document.querySelector('#list').innerHTML='<h2>Registrovane firme</h2>'+ (d.length?d.map(x=>'<div class="business"><b>'+x.name+'</b><p>'+x.city_name+', '+x.country_code+' · '+x.verification_status+'</p></div>').join(''):'<p>Još nema registrovanih firmi.</p>')}document.querySelector('#create').onclick=async()=>{const p={name:name.value,country_code:country.value.toUpperCase(),city_name:city.value,address:address.value||null,tax_id:tax.value||null,description:description.value||null};const r=await fetch('/api/businesses',{method:'POST',headers:h,body:JSON.stringify(p)}),d=await r.json();document.querySelector('#status').textContent=r.ok?'Firma je sačuvana i čeka verifikaciju.':(d.detail||'Greška');if(r.ok)load()};load()</script></html>''')

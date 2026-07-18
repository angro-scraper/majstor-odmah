"""Balkan.works Design System tokens and accessibility layer."""

from __future__ import annotations

from superapp_v4 import render_superapp_page as render_v4


def render_superapp_page(language: str = "SR", initial_tab: str = "home", initial_module: str = "") -> str:
    page = render_v4(language, initial_tab, initial_module)
    tokens = '''<style>:root{--ink:#111827;--pine:#0F172A;--paper:#F8FAFC;--card:#FFFFFF;--orange:#F97316;--mint:#DCFCE7;--line:#E2E8F0;--muted:#64748B;--green:#16A34A}.dash-card.services{background:linear-gradient(135deg,#1D4ED8,#3B82F6)}.dash-card.jobs{background:linear-gradient(135deg,#6D28D9,#8B5CF6)}.dash-card.money{background:linear-gradient(135deg,#047857,#16A34A)}.theme-toggle{border:1px solid var(--line);background:var(--card);color:var(--pine);border-radius:11px;padding:10px 11px;cursor:pointer}.top-actions{display:flex;gap:8px;align-items:center}.global-search input:focus-visible,.global-search button:focus-visible,button:focus-visible,a:focus-visible{outline:3px solid #F9731680;outline-offset:3px}body.dark{--ink:#F8FAFC;--pine:#E2E8F0;--paper:#0F172A;--card:#172033;--orange:#FB923C;--mint:#153C2A;--line:#334155;--muted:#A8B4C7;background:var(--paper)}body.dark .global-search,body.dark .location,body.dark .theme-toggle,body.dark .explore-card,body.dark .panel,body.dark .profile-head,body.dark .rows,body.dark .feed article,body.dark .empty,body.dark .module-toggle,body.dark .module-order button,body.dark .dashboard-tools button{background:var(--card);color:var(--ink)}body.dark .bottom{background:#0f172af0}body.dark .soft{background:#ffffff16}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}</style>'''
    page = page.replace("</head>", tokens + "</head>", 1)
    page = page.replace('placeholder="Pretraži ponude, hranu, usluge, firme…"', 'placeholder="Šta tražiš danas?" aria-label="Univerzalna pretraga Balkan.works"', 1)
    page = page.replace('<button class="location" id="location-button">⌖ Tvoja lokacija</button>', '<div class="top-actions"><button class="location" id="location-button">⌖ Tvoja lokacija</button><button class="theme-toggle" id="theme-toggle" aria-label="Promeni temu">◐</button></div>', 1)
    script = '''<script>const savedTheme=localStorage.getItem('balkan_theme');if(savedTheme==='dark'||(!savedTheme&&matchMedia('(prefers-color-scheme: dark)').matches))document.body.classList.add('dark');document.getElementById('theme-toggle').onclick=()=>{document.body.classList.toggle('dark');localStorage.setItem('balkan_theme',document.body.classList.contains('dark')?'dark':'light')};</script>'''
    return page.replace("</body>", script + "</body>", 1)

"use client";

import { useEffect, useState } from "react";
import { AppShell } from "../../src/components/app-shell";
import { ApiSaveFoodPackage, listSaveFoodPackages } from "../../src/lib/api";

type FoodPackage = { id: string; business: string; title: string; original: number; price: number; left: number; pickup: string; tone: string; };
const fallbackPackages: FoodPackage[] = [
  { id: "pecivo", business: "Pekara Kralj", title: "Večernji paket peciva", original: 800, price: 240, left: 4, pickup: "Danas · 19:30–20:30", tone: "bread" },
  { id: "bistro", business: "Bistro Grad", title: "Dnevni obrok iz kuhinje", original: 1100, price: 390, left: 2, pickup: "Danas · 20:00–21:00", tone: "meal" },
  { id: "market", business: "Zeleni Market", title: "Paket voća i povrća", original: 950, price: 320, left: 7, pickup: "Sutra · 08:00–10:00", tone: "produce" },
];

function fromApiPackage(item: ApiSaveFoodPackage, index: number): FoodPackage {
  const pickup = `${new Intl.DateTimeFormat("sr-RS", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(item.pickupStart))}–${new Intl.DateTimeFormat("sr-RS", { hour: "2-digit", minute: "2-digit" }).format(new Date(item.pickupEnd))}`;
  return { id: item.id, business: item.business?.name ?? "Lokalna firma", title: item.title, original: Number(item.originalPrice), price: Number(item.discountPrice), left: item.quantity, pickup, tone: ["bread", "meal", "produce"][index % 3] };
}

export default function SaveFoodPage() {
  const [packages, setPackages] = useState<FoodPackage[]>(fallbackPackages);
  const [reserved, setReserved] = useState<FoodPackage | null>(null);
  useEffect(() => {
    listSaveFoodPackages().then((items) => {
      if (items.length) setPackages(items.map(fromApiPackage));
    }).catch(() => undefined);
  }, []);
  return <AppShell active="deals">
    <section className="save-food-hero"><span>🌿 SAVE FOOD</span><h1>Manje otpada.<br />Više dobrih obroka.</h1><p>Preuzmi kvalitetne pakete hrane iz lokalnih firmi po nižoj ceni.</p><div><b>♻</b><span>Svako preuzimanje pomaže lokalnim firmama i smanjuje bacanje hrane.</span></div></section>
    <section className="save-food-content"><div className="deals-section-head"><div><p>BLIZU TEBE</p><h2>Danas za preuzimanje</h2></div><a href="/search">Mapa →</a></div><div className="food-package-list">{packages.map((item) => <article className="food-package" key={item.id}><div className={`food-visual ${item.tone}`}>{item.tone === "bread" ? "🥐" : item.tone === "meal" ? "🥗" : "🍎"}<span>{item.left} ostalo</span></div><div className="food-package-body"><p>{item.business}</p><h3>{item.title}</h3><div className="food-prices"><strong>{item.price} RSD</strong><s>{item.original} RSD</s><b>-{Math.round((1 - item.price / item.original) * 100)}%</b></div><small>◷ {item.pickup}</small><button onClick={() => setReserved(item)}>Rezerviši paket →</button></div></article>)}</div><article className="save-food-impact"><span>🌱</span><div><p>TVOG UTICAJA OVE NEDELJE</p><strong>3 paketa sačuvana</strong><small>To je 4,2 kg hrane koja nije završila kao otpad.</small></div></article></section>
    {reserved && <div className="deal-modal-backdrop" role="dialog" aria-modal="true" aria-label="Potvrdi rezervaciju"><article className="deal-modal reservation-modal"><button className="modal-close" onClick={() => setReserved(null)} aria-label="Zatvori">×</button><span className="reservation-symbol">✓</span><p>SAVE FOOD REZERVACIJA</p><h2>{reserved.title}</h2><strong className="reservation-price">{reserved.price} RSD</strong><small>Preuzimanje: {reserved.pickup}</small><div className="pickup-note">Nakon prijave dobijaš jedinstveni kod za preuzimanje koji firma potvrđuje pri dolasku.</div><a className="deal-primary" href="/onboarding">Prijavi se i rezerviši →</a></article></div>}
  </AppShell>;
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "../../src/components/app-shell";
import { ApiDeal, listDeals } from "../../src/lib/api";

type Deal = { id: string; store: string; title: string; category: string; oldPrice: number; price: number; expires: string; accent: string; };
const fallbackDeals: Deal[] = [
  { id: "maxi-kafa", store: "Maxi", title: "Grand kafa 200 g", category: "Hrana", oldPrice: 529, price: 359, expires: "Važi do nedelje", accent: "orange" },
  { id: "tehnomanija", store: "Tehnomanija", title: "Sony WH-CH520", category: "Tehnika", oldPrice: 6999, price: 4999, expires: "Još 2 dana", accent: "blue" },
  { id: "lilly", store: "Lilly", title: "Nega lica – odabrani proizvodi", category: "Kozmetika", oldPrice: 1290, price: 799, expires: "Važi do 28. jula", accent: "pink" },
  { id: "idea", store: "IDEA", title: "Porodični paket voća", category: "Hrana", oldPrice: 980, price: 590, expires: "Danas do 22h", accent: "green" },
];
const categories = ["Sve", "Hrana", "Piće", "Tehnika", "Odeća", "Kuća", "Kozmetika"];

function fromApiDeal(deal: ApiDeal, index: number): Deal {
  const oldPrice = Number(deal.price ?? deal.discountPrice ?? 0);
  const price = Number(deal.discountPrice ?? deal.price ?? 0);
  return {
    id: deal.id,
    store: deal.business?.name ?? "Lokalna ponuda",
    title: deal.title,
    category: deal.category?.name ?? "Sve",
    oldPrice: oldPrice || price || 1,
    price: price || oldPrice || 1,
    expires: deal.expiresAt ? `Važi do ${new Intl.DateTimeFormat("sr-RS", { day: "numeric", month: "short" }).format(new Date(deal.expiresAt))}` : "Aktuelna ponuda",
    accent: ["orange", "blue", "pink", "green"][index % 4],
  };
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>(fallbackDeals);
  const [activeCategory, setActiveCategory] = useState("Sve");
  const [saved, setSaved] = useState<string[]>([]);
  const [selected, setSelected] = useState<Deal | null>(null);
  useEffect(() => {
    listDeals().then((items) => {
      if (items.length) setDeals(items.map(fromApiDeal));
    }).catch(() => undefined);
  }, []);
  const visibleDeals = useMemo(() => activeCategory === "Sve" ? deals : deals.filter((deal) => deal.category === activeCategory), [activeCategory]);
  return <AppShell active="deals">
    <section className="deals-hero"><span>🏷 LOKALNE AKCIJE</span><h1>Ponude koje vredi otvoriti danas.</h1><p>Digitalni flajeri, akcije i cene iz prodavnica u tvojoj blizini.</p><a href="#flyers">Pregledaj flajere →</a></section>
    <section className="deals-content">
      <div className="deals-filter-row" aria-label="Kategorije ponuda">{categories.map((category) => <button className={activeCategory === category ? "active" : ""} onClick={() => setActiveCategory(category)} key={category}>{category}</button>)}</div>
      <div className="deals-section-head"><div><p>U TVOJOJ BLIZINI</p><h2>Aktuelne akcije</h2></div><button className="deals-filter">⌘ Filteri</button></div>
      <div className="deals-grid">{visibleDeals.map((deal) => { const discount = Math.round((1 - deal.price / deal.oldPrice) * 100); return <article className={`deal-card ${deal.accent}`} key={deal.id}><div className="deal-card-visual"><span>{deal.store.slice(0, 1)}</span><b>-{discount}%</b></div><div className="deal-card-body"><p>{deal.store}</p><h3>{deal.title}</h3><div><strong>{deal.price.toLocaleString("sr-RS")} RSD</strong><s>{deal.oldPrice.toLocaleString("sr-RS")} RSD</s></div><small>⌖ {deal.expires}</small><footer><button onClick={() => setSelected(deal)}>Detalji</button><button aria-label="Sačuvaj ponudu" onClick={() => setSaved((items) => items.includes(deal.id) ? items.filter((id) => id !== deal.id) : [...items, deal.id])}>{saved.includes(deal.id) ? "♥ Sačuvano" : "♡ Sačuvaj"}</button></footer></div></article>; })}</div>
      <section id="flyers" className="flyer-strip"><div><p>DIGITALNI FLAJERI</p><h2>Prelistaj akcije omiljenih prodavnica.</h2><span>Otvaraj, sačuvaj i podeli ponude bez papirnih flajera.</span></div><div className="flyer-preview"><b>VIKEND AKCIJA</b><strong>do -40%</strong><small>Maxi · Tehnomanija · Lilly</small><button onClick={() => setSelected(deals[0] ?? null)}>Otvori flajer →</button></div></section>
    </section>
    {selected && <div className="deal-modal-backdrop" role="dialog" aria-modal="true" aria-label="Detalji ponude"><article className="deal-modal"><button className="modal-close" onClick={() => setSelected(null)} aria-label="Zatvori">×</button><span className={`deal-modal-image ${selected.accent}`}>{selected.store}</span><p>{selected.store} · {selected.category}</p><h2>{selected.title}</h2><div className="modal-price"><strong>{selected.price.toLocaleString("sr-RS")} RSD</strong><s>{selected.oldPrice.toLocaleString("sr-RS")} RSD</s></div><small>⌖ {selected.expires} · Dostupno u Beogradu</small><p className="modal-copy">Ponuda je dostupna u digitalnom flajeru. Proveri najbližu prodavnicu pre posete.</p><button className="deal-primary" onClick={() => setSaved((items) => items.includes(selected.id) ? items : [...items, selected.id])}>♥ Sačuvaj ponudu</button></article></div>}
  </AppShell>;
}

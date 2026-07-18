"use client";

import { FormEvent, useState } from "react";
import { AppShell } from "../../src/components/app-shell";
import { BusinessCard } from "../../src/components/business-card";
import { businesses } from "../../src/lib/demo-data";

const categories = [
  ["⌕", "Kućne usluge", "home-services"], ["♨", "Hrana", "food"],
  ["▱", "Auto", "auto"], ["✚", "Zdravlje", "health"],
  ["⌂", "Nekretnine", "real-estate"], ["✦", "Lepota", "beauty"],
  ["▣", "Edukacija", "education"], ["✈", "Putovanja", "travel"],
];

export default function CustomerHomePage() {
  const [query, setQuery] = useState("");
  function search(event: FormEvent) { event.preventDefault(); window.location.href = `/search?q=${encodeURIComponent(query)}`; }
  return <AppShell active="home">
    <section className="customer-home">
      <div className="customer-welcome"><span>⌖ Beograd, Srbija</span><button aria-label="Obaveštenja">♧</button><h1>Dobrodošao nazad!</h1><p>Šta ti treba danas?</p></div>
      <form className="customer-ai-search" onSubmit={search}><b>✦ AI-Powered Search</b><div><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Treba mi električar danas…" /><button type="submit">➤</button></div><p><button type="button" onClick={() => setQuery("Električar blizu mene")}>Električar</button><button type="button" onClick={() => setQuery("Vodoinstalater danas")}>Vodoinstalater</button><button type="button" onClick={() => setQuery("Otvoreno danas")}>Danas</button><button type="button" onClick={() => setQuery("U mojoj blizini")}>U blizini</button></p></form>
      <section className="customer-categories"><h2>Kategorije</h2><div>{categories.map(([icon,name,slug], index) => <a href={`/search?category=${slug}`} className={`customer-category tone-${index}`} key={name}><b>{icon}</b><span>{name}</span></a>)}</div></section>
      <section className="customer-daily-modules"><a href="/deals"><span>🏷</span><div><b>Deals i flajeri</b><small>Lokalne akcije koje ne propuštaš.</small></div><i>→</i></a><a href="/save-food"><span>🌿</span><div><b>Save Food</b><small>Povoljni paketi hrane blizu tebe.</small></div><i>→</i></a></section>
      <section className="customer-recommended"><div><h2>Preporučeno za tebe</h2><a href="/search">Prikaži sve</a></div><div className="business-list">{businesses.slice(0,3).map((business) => <BusinessCard business={business} key={business.id} />)}</div></section>
    </section>
  </AppShell>;
}

"use client";

import { FormEvent, useState } from "react";
import { AppShell } from "../../src/components/app-shell";
import { BusinessCard } from "../../src/components/business-card";
import { EmptyState, ErrorState, Input, Skeleton } from "../../src/components/ui";
import { businesses } from "../../src/lib/demo-data";
import { searchBusinesses, toBusinessCard } from "../../src/lib/api";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(businesses);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;
    setLoading(true); setError("");
    try { setResults((await searchBusinesses(query.trim())).map(toBusinessCard)); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Pretraga trenutno nije dostupna."); }
    finally { setLoading(false); }
  }

  return <AppShell active="Discover">
    <section className="page-heading search-heading"><p>PRETRAGA</p><h1>Pronađi ono što ti treba</h1>
      <form className="search-field" onSubmit={submit}><span>⌕</span><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pretraži firme, usluge i ponude..." aria-label="Pretraži firme, usluge i ponude"/><button type="submit" aria-label="Pokreni pretragu">›</button></form>
      <div className="filter-row"><button type="button">⌖ Lokacija</button><button type="button">⊞ Kategorija</button><button type="button">★ Ocena</button><button type="button">◷ Otvoreno</button></div>
    </section>
    <section className="screen-section compact"><div className="sort-row"><span>{loading ? "Pretražujemo…" : `${results.length} rezultata`}</span><button type="button">Najbolje ↓</button></div>
      {error ? <ErrorState message={error} /> : loading ? <div className="business-list"><Skeleton height={220}/><Skeleton height={220}/></div> : results.length ? <div className="business-list">{results.map(business => <BusinessCard business={business} key={business.id}/>)}</div> : <EmptyState title="Nema rezultata" description="Pokušaj sa drugim nazivom usluge ili proveri lokaciju." />}
    </section>
  </AppShell>;
}

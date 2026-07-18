"use client";

import { useState } from "react";
import { AppShell } from "../../src/components/app-shell";
import { BusinessCard } from "../../src/components/business-card";
import { AIResponseCard, AISearchBar } from "../../src/components/ai-components";
import { EmptyState, ErrorState, Skeleton } from "../../src/components/ui";
import { AiSearchResult, aiSearch, toBusinessCard } from "../../src/lib/api";

const prompts = ["Treba mi majstor danas", "Najbolji frizer blizu mene", "Uporedi servise"];

export default function AiPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<AiSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function ask(value = query) {
    if (!value.trim()) return;
    setQuery(value); setLoading(true); setError("");
    try { setResult(await aiSearch(value.trim())); }
    catch (caught) { setResult(null); setError(caught instanceof Error ? caught.message : "Balkan AI trenutno nije dostupan."); }
    finally { setLoading(false); }
  }

  return <AppShell active="AI">
    <section className="ai-hero"><span className="ai-orb">✦</span><p>BALKAN.WORKS AI</p><h1>Kako mogu pomoći?</h1><span>Reci šta ti treba, a mi ćemo pronaći lokalno rešenje.</span>
      <AISearchBar query={query} onQueryChange={setQuery} onSubmit={(event) => { event.preventDefault(); void ask(); }} />
      <div className="prompt-examples">{prompts.map(item => <button onClick={() => void ask(item)} key={item}>{item}</button>)}</div>
    </section>
    <section className="ai-conversation"><div className="ai-message"><span className="ai-message-avatar">✦</span><p>Zdravo, ja sam Balkan AI. Kako mogu da pomognem danas?</p></div>
      {loading && <div className="business-list"><Skeleton height={132}/><Skeleton height={220}/></div>}
      {error && <ErrorState message={error} />}
      {result && <><div className="user-message"><p>{result.query}</p></div><AIResponseCard /><div className="ai-answer"><span>AI tumačenje zahteva</span><h2>{result.intent.needs.join(", ")}</h2><p>{result.explanation}</p></div><div className="section-title"><div><p>NAJBOLJE OPCIJE</p><h2>Preporučeni rezultati</h2></div></div>{result.results.length ? <div className="business-list">{result.results.map((business) => <BusinessCard business={toBusinessCard(business)} key={business.id}/>)}</div> : <EmptyState title="Još nema odgovarajućih firmi" description="Probaj da dodaš grad ili drugačije opišeš uslugu." />}</>}
    </section>
  </AppShell>;
}

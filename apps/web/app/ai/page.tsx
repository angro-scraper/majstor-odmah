"use client";
import { useState } from "react";
import { AppShell } from "../../src/components/app-shell";
import { BusinessCard } from "../../src/components/business-card";
import { AIResponseCard, AISearchBar } from "../../src/components/ai-components";
import { businesses } from "../../src/lib/demo-data";

export default function AiPage() { const [query, setQuery] = useState(""); const [asked, setAsked] = useState(false); return <AppShell active="AI"><section className="ai-hero"><span className="ai-orb">✦</span><p>BALKAN AI</p><h1>Kako mogu pomoći?</h1><AISearchBar query={query} onQueryChange={setQuery} onSubmit={(event) => { event.preventDefault(); setAsked(true); }} /><div className="prompt-examples">{["Treba mi majstor danas", "Najbolji frizer blizu mene", "Uporedi servise"].map((item) => <button onClick={() => { setQuery(item); setAsked(true); }} key={item}>“{item}”</button>)}</div></section>{asked && <section className="screen-section"><AIResponseCard /><div className="business-list">{businesses.slice(0, 2).map((business) => <BusinessCard business={business} key={business.id} />)}</div></section>}</AppShell>; }

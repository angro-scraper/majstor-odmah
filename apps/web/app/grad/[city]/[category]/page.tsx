import type { Metadata } from "next";
import { AppShell } from "../../../../src/components/app-shell";

type Result = { id: string; slug: string | null; name: string; description: string | null; category: { name: string } | null; locations: Array<{ city: { name: string } }> };
const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1").replace(/\/$/, "");
const label = (value: string) => value.replace(/-/g, " ").replace(/\b\w/g, character => character.toUpperCase());

export async function generateMetadata({ params }: { params: Promise<{ city: string; category: string }> }): Promise<Metadata> {
  const { city, category } = await params;
  return { title: `${label(category)} u ${label(city)} | Balkan.works`, description: `Pronađi proverene ${label(category).toLowerCase()} u gradu ${label(city)} na Balkan.works.` };
}

export default async function CityCategoryPage({ params }: { params: Promise<{ city: string; category: string }> }) {
  const { city, category } = await params;
  const cityName = label(city); const categoryName = label(category);
  const response = await fetch(`${apiBase}/search?query=${encodeURIComponent(categoryName)}&city=${encodeURIComponent(cityName)}`, { cache: "no-store" });
  const body = response.ok ? await response.json() as { data?: Result[] } : {};
  const results = body.data ?? [];
  return <AppShell active="services"><section className="module-hero tone-blue"><p className="label">LOKALNO OTKRIVANJE</p><h1>{categoryName} u {cityName}</h1><p>Proverene lokalne firme, usluge i jasni kontakt podaci na jednom mestu.</p></section><section className="screen-section"><div className="section-title"><div><p>REZULTATI</p><h2>{results.length ? `${results.length} dostupnih firmi` : "Uskoro stižu firme"}</h2></div><a href={`/search?q=${encodeURIComponent(categoryName)}`}>Promeni pretragu</a></div><div className="service-grid">{results.map(result => <a className="service-card" key={result.id} href={`/business/${result.slug ?? result.id}`}><span>↗</span><h3>{result.name}</h3><p>{result.description ?? `${result.category?.name ?? categoryName} · ${result.locations[0]?.city.name ?? cityName}`}</p></a>)}</div>{!results.length && <p className="empty-state">Još nema javnih rezultata za ovu kategoriju. Pretraži šire ili predloži lokalnu firmu.</p>}</section></AppShell>;
}

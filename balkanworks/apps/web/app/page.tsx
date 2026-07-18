"use client";

import { FormEvent, useMemo, useState } from "react";

type Business = { id: string; name: string; category: string; city: string; description: string; phone: string; verified: boolean; rating: string };

const initialBusinesses: Business[] = [
  { id: "demo-auto", name: "Auto Servis Marković", category: "Auto servis", city: "Beograd", description: "Servis, dijagnostika i brze popravke uz prethodni dogovor.", phone: "+381 11 555 0101", verified: true, rating: "4.8" },
  { id: "demo-beauty", name: "Studio Luma", category: "Beauty", city: "Beograd", description: "Frizerske i beauty usluge sa jasnim terminima i kontaktom.", phone: "+381 11 555 0102", verified: true, rating: "4.9" },
  { id: "demo-health", name: "Ordinacija Most", category: "Zdravstvo", city: "Novi Sad", description: "Privatna ordinacija sa dostupnim lokalnim informacijama.", phone: "+381 21 555 0103", verified: false, rating: "4.7" },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("Sve lokacije");
  const [saved, setSaved] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const results = useMemo(() => initialBusinesses.filter((business) => {
    const haystack = `${business.name} ${business.category} ${business.description}`.toLowerCase();
    return (!query || haystack.includes(query.toLowerCase())) && (city === "Sve lokacije" || business.city === city);
  }), [query, city]);

  function search(event: FormEvent) { event.preventDefault(); setSubmitted(true); }
  function toggleSaved(id: string) { setSaved((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]); }

  return <main>
    <header className="topbar"><a className="brand" href="#top">balkan<span>.works</span></a><nav><a href="#discover">Istraži</a><a href="#for-business">Za firme</a><a href="#saved">Sačuvano ({saved.length})</a></nav></header>
    <section id="top" className="hero"><p className="eyebrow">LOKALNO, PROVERENO, KORISNO</p><h1>Pronađi firmu koja rešava tvoj problem.</h1><p className="lede">Balkan.works povezuje ljude sa lokalnim firmama kroz jasne informacije, poverenje i brzu akciju.</p>
      <form className="search-panel" onSubmit={search}><label><span>Šta ti treba?</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Na primer: auto servis" /></label><label><span>Gde?</span><select value={city} onChange={(event) => setCity(event.target.value)}><option>Sve lokacije</option><option>Beograd</option><option>Novi Sad</option></select></label><button type="submit">Pronađi firme</button></form>
      <p className="trust-line">Bez registracije za pretragu · Registruj se kada želiš da sačuvaš ili kontaktiraš firmu</p>
    </section>
    <section id="discover" className="content"><div className="section-heading"><div><p className="eyebrow">LOKALNO OTKRIVANJE</p><h2>{submitted ? "Rezultati pretrage" : "Firme koje možeš istražiti"}</h2></div><p>{results.length} rezultata</p></div><div className="cards">{results.map((business) => <article className="business-card" key={business.id}><div className="card-top"><div className="initial">{business.name[0]}</div><div><p className="category">{business.category} · {business.city}</p><h3>{business.name}</h3></div>{business.verified && <span className="verified">Provereno</span>}</div><p>{business.description}</p><div className="card-footer"><span>★ {business.rating}</span><div><a className="contact" href={`tel:${business.phone.replace(/\s/g, "")}`}>Pozovi</a><button className="save" onClick={() => toggleSaved(business.id)}>{saved.includes(business.id) ? "Sačuvano" : "Sačuvaj"}</button></div></div></article>)}</div>{results.length === 0 && <div className="empty"><h3>Nema rezultata za ovu pretragu.</h3><p>Pokušaj drugu kategoriju ili lokaciju. Uskoro možeš predložiti lokalnu firmu koju želiš da vidiš.</p></div>}</section>
    <section id="for-business" className="business-cta"><div><p className="eyebrow">ZA LOKALNE FIRME</p><h2>Budite tamo gde vas ljudi traže.</h2><p>Napravite poslovni profil, unesite usluge i pratite stvarne kontakte.</p></div><a href="mailto:hello@balkan.works?subject=Business%20profile">Kreiraj profil firme</a></section>
    <footer id="saved"><p>© Balkan.works · Digitalna lokalna mreža</p><p>Demo podaci se prikazuju dok lokalni API i baza nisu pokrenuti.</p></footer>
  </main>;
}

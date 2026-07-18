import { AppShell } from "../../../src/components/app-shell";

const profiles: Record<string, { name: string; category: string; description: string; price: string; city: string }> = {
  "elektricar-marko": { name: "Električar Marko", category: "Elektro instalacije", description: "Brze, uredne i bezbedne elektro intervencije za stanove, kuće i poslovne prostore.", price: "od 2.000 RSD", city: "Beograd, Vračar" },
};

export default async function ServiceProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = profiles[slug] ?? { name: "Provereni profesionalac", category: "Lokalne usluge", description: "Profil profesionalca sa ponudama, dostupnošću i ocenama korisnika.", price: "Po dogovoru", city: "Beograd" };
  return <AppShell active="deals"><section className="economy-content detail-page"><a className="back-link" href="/services">← Sve usluge</a><header className="detail-hero"><span className="provider-avatar large">EM</span><div><small>✓ VERIFIKOVAN PROFESIONALAC</small><h1>{profile.name}</h1><p>{profile.category} · {profile.city}</p><strong>★ 4,9 <em>(124 ocene)</em></strong></div></header><div className="trust-grid"><div><strong>98%</strong><span>Quality score</span></div><div><strong>99%</strong><span>Odgovara brzo</span></div><div><strong>8 god.</strong><span>Iskustva</span></div></div><section className="detail-layout"><article className="economy-panel"><h2>O profesionalcu</h2><p>{profile.description}</p><h2>Usluge</h2><ul className="feature-list"><li>Hitne elektro intervencije</li><li>Montaža i popravka rasvete</li><li>Instalacije za dom i firmu</li></ul></article><aside className="booking-card"><span>Početna cena</span><strong>{profile.price}</strong><p>Dostupan danas do 20:00</p><a className="button primary" href="/ai">Pošalji zahtev</a><a className="button secondary" href="/messages">Pošalji poruku</a></aside></section></section></AppShell>;
}

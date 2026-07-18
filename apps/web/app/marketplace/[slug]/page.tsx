import { AppShell } from "../../../src/components/app-shell";

export default async function MarketplaceItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = slug === "macbook-air-m2" ? "MacBook Air M2" : "Lokalni oglas";
  return <AppShell active="deals"><section className="economy-content detail-page"><a className="back-link" href="/marketplace">← Marketplace</a><section className="marketplace-detail"><div className="market-visual detail-visual">⌘</div><div><small>ELEKTRONIKA · BEOGRAD</small><h1>{title}</h1><strong className="detail-price">950 €</strong><p>Odlično očuvan uređaj, potpuno ispravan i spreman za preuzimanje u Beogradu. Detalje dogovori direktno sa prodavcem.</p><div className="trust-grid compact"><div><strong>✓</strong><span>Verifikovan nalog</span></div><div><strong>24h</strong><span>Odgovara brzo</span></div></div><div className="inline-actions"><a className="button primary" href="/messages">Pošalji poruku</a><a className="button secondary" href="/favorites">Sačuvaj oglas</a></div></div></section></section></AppShell>;
}

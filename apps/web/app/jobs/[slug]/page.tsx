import { AppShell } from "../../../src/components/app-shell";

export default async function JobDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = slug === "front-end-developer" ? "Front-end Developer" : "Otvorena pozicija";
  return <AppShell active="deals"><section className="economy-content detail-page"><a className="back-link" href="/jobs">← Svi poslovi</a><header className="detail-hero"><span className="provider-avatar large">▦</span><div><small>NOVA PRILIKA</small><h1>{title}</h1><p>Nelt Group · Beograd · Hibridno</p><strong>2.000 – 3.000 € <em>mesečno</em></strong></div></header><section className="detail-layout"><article className="economy-panel"><h2>O poziciji</h2><p>Tražimo osobu koja želi da gradi kvalitetno digitalno iskustvo za korisnike širom Balkana, u malom timu sa jasnim uticajem na proizvod.</p><h2>Šta donosiš</h2><ul className="feature-list"><li>Iskustvo sa React i TypeScript tehnologijama</li><li>Razumevanje dostupnog, brzog UI-ja</li><li>Jasnu komunikaciju i ownership</li></ul></article><aside className="booking-card"><span>Tip angažovanja</span><strong>Puno radno vreme</strong><p>Prijave otvorene do 31. jula</p><a className="button primary" href="/profile">Prijavi se na poziciju</a><a className="button secondary" href="/messages">Pitaj poslodavca</a></aside></section></section></AppShell>;
}

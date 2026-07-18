import "./v0-landing.css";

const categories = [
  ["⌘", "Poslovi", "Pronađi prilike i poveži se sa poslodavcima."],
  ["⌕", "Majstori i usluge", "Pouzdani lokalni profesionalci kad god zatrebaju."],
  ["▦", "Kupovina", "Ponude, proizvodi i pametne lokalne akcije."],
  ["↗", "Dostava hrane", "Omiljena mesta i dostava bez komplikacija."],
  ["✈", "Putovanja", "Karte, smeštaj i planovi za sledeće putovanje."],
  ["✚", "Zdravlje", "Lekari, klinike i podrška za tvoje zdravlje."],
  ["▣", "Edukacija", "Kursevi, časovi i nova znanja u blizini."],
  ["✦", "AI pomoćnik", "Rešenja, preporuke i pomoć baš kada ti treba."],
];

function PhonePreview({ wallet = false }: { wallet?: boolean }) {
  return <div className={`v0-phone ${wallet ? "v0-phone-wallet" : ""}`}>
    <div className="v0-notch" /><div className="v0-status">9:41 <span>▰ ▰ ◉</span></div>
    <div className="v0-phone-brand"><b>b</b> balkan<span>.works</span><i>♧</i></div>
    <div className="v0-balance"><small>{wallet ? "Dostupna sredstva" : "Ukupno stanje"}</small><strong>12.450,00 RSD</strong><em>RS35 2650 0000 1234 5678 90</em><div><button>＋ Dodaj</button><button>⌁ Pošalji</button></div></div>
    {wallet ? <div className="v0-transactions"><h4>Nedavne transakcije</h4><p><b>↗</b> Wolt <span>-1.250,00</span></p><p><b>↗</b> Maxi <span>-2.435,50</span></p><p className="income"><b>↙</b> Isplata <span>+15.000,00</span></p></div> : <><h4 className="v0-label">Kategorije</h4><div className="v0-mini-cats"><span>▦<small>Poslovi</small></span><span>⌕<small>Usluge</small></span><span>♨<small>Dostava</small></span><span>✈<small>Putovanja</small></span></div><div className="v0-mini-offer">Wolt+ popust 20%<br /><small>na prvu narudžbinu</small></div></>}
    <div className="v0-phone-nav"><span>⌂<small>Početna</small></span><span>▦<small>Usluge</small></span><b>✦</b><span>◌<small>Poruke</small></span><span>◉<small>Profil</small></span></div>
  </div>;
}

export default function HomePage() {
  return <main className="v0-site">
    <header className="v0-header"><a href="/" className="v0-logo"><b>b</b><span>balkan<span>.works</span></span></a><nav><a href="/">Početna</a><a href="/search">Usluge</a><a href="/dashboard">Za kompanije</a><a href="/o-nama">O nama</a><a href="/kontakt">Kontakt</a></nav><div className="v0-header-actions"><a href="/onboarding">Prijavi se</a><a className="v0-download" href="/app">⌄&nbsp; Preuzmi aplikaciju</a></div></header>
    <section className="v0-hero"><div className="v0-hero-copy"><span className="v0-eyebrow">✦&nbsp; Super aplikacija za Balkan</span><h1>Sve usluge na<br />jednom mestu</h1><p>Jedna aplikacija za svakodnevni život i poslovanje širom Balkana. Poslovi, majstori, dostava, putovanja, zdravlje i novčanik — sve na dohvat ruke.</p><div className="v0-hero-actions"><a className="v0-primary" href="/app">Preuzmi aplikaciju&nbsp; →</a><a className="v0-secondary" href="/search">Istraži usluge</a></div><div className="v0-store-row"><span>●&nbsp; Preuzmi na<br /><b>App Store</b></span><span>▶&nbsp; Preuzmi na<br /><b>Google Play</b></span></div><div className="v0-rating"><i /> <i /> <i /> <i /> <b>★ 4.9 / 5 · 38.000+ ocena</b></div></div><div className="v0-phones"><div className="v0-floating">▦ <b>Novi posao za vas</b><small>Front-end Developer</small></div><PhonePreview wallet /><PhonePreview /><div className="v0-delivery">♨&nbsp; Dostava stiže<br /><small>★ 4.9 · 25 min</small></div></div></section>
    <section className="v0-services"><div className="v0-section-title"><span>USLUGE</span><h2>Sve što vam treba,<br />u jednoj aplikaciji</h2><p>Od posla i majstora do putovanja i zdravlja — pronađite pravu uslugu u samo nekoliko dodira.</p></div><div className="v0-category-grid">{categories.map(([icon,title,text]) => <a href="/search" key={title}><b>{icon}</b><h3>{title}</h3><p>{text}</p><em>→</em></a>)}</div></section>
    <section className="v0-steps"><div className="v0-section-title"><span>KAKO FUNKCIONIŠE</span><h2>Do rešenja u četiri koraka</h2><p>Jednostavan proces koji vas povezuje sa pravim ljudima i uslugama.</p></div><div className="v0-step-grid">{[["01","Napravi nalog","Jedna prijava za sve usluge."],["02","Izaberi uslugu","Pronađi kategoriju koja ti treba."],["03","Poveži se sa firmom","Kontaktiraj, rezerviši ili uporedi."],["04","Plati bezbedno","Završi posao uz sigurnu aplikaciju."]].map(([n,t,d])=><article key={n}><b>{n}</b><h3>{t}</h3><p>{d}</p></article>)}</div></section>
    <section className="v0-stat-band"><b>1.2M+<small>korisnika</small></b><b>45.000+<small>pružalaca usluga</small></b><b>12M+<small>uspešnih interakcija</small></b><b>4.9/5<small>prosečna ocena</small></b></section>
    <section className="v0-ai-section"><div><span>✦ BALKAN AI</span><h2>Pametni pomoćnik<br />koji radi umesto vas</h2><p>Kažite šta vam treba, a Balkan AI pronalazi najbolje lokalne opcije, upoređuje ponude i predlaže sledeći korak.</p><a href="/ai">Razgovaraj sa Balkan AI →</a></div><div className="v0-ai-card"><b>✦ balkan.works AI</b><p className="v0-ai-user">Treba mi električar blizu mene.</p><p>Znam proverene električare u Beogradu koji mogu doći danas.</p><article>Električar Marković <strong>4.9 · 1.2 km</strong></article><article>Brza kućna pomoć <strong>4.8 · 2.1 km</strong></article><input placeholder="Napišite poruku…" /></div></section>
    <section className="v0-business"><div className="v0-business-chart"><b>Rezultati firme</b><div><strong>4.350</strong><strong>120</strong><strong>4.9</strong></div><svg viewBox="0 0 560 150" aria-hidden="true"><path d="M0 125 C75 95 100 110 150 65 S250 115 310 70 S420 25 560 48" /></svg></div><div><span>ZA KOMPANIJE</span><h2>Vodite ceo biznis<br />sa jednog mesta</h2><p>Od profila firme do ponuda i komunikacije sa kupcima, balkan.works je vaš digitalni kanal za rast.</p><ul><li>Digitalni profil firme</li><li>Promocije i ponude</li><li>Analitika i preporuke</li><li>Jednostavna komunikacija</li></ul><a href="/dashboard">Pokrenite poslovni profil →</a></div></section>
    <section className="v0-download-strip"><div><h2>Ceo Balkan u<br />jednoj aplikaciji</h2><p>Pronađite lokalne usluge, poslove i prilike — brzo, lako i sigurno.</p><span>● App Store</span> <span>▶ Google Play</span></div><PhonePreview /></section>
    <footer className="v0-footer"><a className="v0-logo" href="/"><b>b</b><span>balkan<span>.works</span></span></a><p>Super aplikacija za svakodnevni život i poslovanje širom Balkana.</p><small>© 2026 balkan.works. Sva prava zadržana.</small></footer>
  </main>;
}

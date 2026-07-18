"use client";

import { useState } from "react";
import { AppShell } from "../../src/components/app-shell";
import { Button, Card } from "../../src/components/ui";
import { Icon } from "../../src/components/icons";

const activities = [["Sačuvana ponuda", "+2", "Danas · Maxi vikend akcija"], ["Save Food rezervacija", "+10", "Juče · Pekara Zlatno zrno"], ["Ocena lokalne firme", "+5", "Pre 2 dana · Brza kućna pomoć"]];

export default function RewardsPage() {
  const [checkedIn, setCheckedIn] = useState(false);
  return <AppShell active="profile"><section className="rewards-page">
    <header className="rewards-heading"><span className="label">BALKAN REWARDS</span><h1>Svaka dobra akcija<br />vredi više.</h1><p>Skupljaj poene kada otkrivaš, čuvaš i podržavaš lokalne firme.</p></header>
    <section className="rewards-balance"><div><span>Trenutni saldo</span><strong>365 <small>poena</small></strong><p><Icon name="sparkle" size={15}/> Explorer · još 135 poena do Local Hero nivoa</p></div><span className="rewards-orb">✦</span></section>
    <section className="rewards-progress"><div><span>Explorer</span><b>365 / 500</b></div><i><em style={{ width: "73%" }} /></i><small>Sledeći nivo otključava posebne lokalne ponude.</small></section>
    <Card className="check-in-card"><div><span className="check-in-icon"><Icon name="calendar" size={20}/></span><div><strong>Dnevni check-in</strong><p>{checkedIn ? "Danas je već zabeleženo. Vraćamo se sutra!" : "Otvori aplikaciju danas i osvoji 5 poena."}</p></div></div><Button disabled={checkedIn} onClick={() => setCheckedIn(true)}>{checkedIn ? "Preuzeto" : "+5 poena"}</Button></Card>
    <section className="rewards-section"><div className="section-title"><div><p>ISTRAŽI VIŠE</p><h2>Aktivni izazovi</h2></div><a href="/deals">Pogledaj ponude</a></div><div className="challenge-grid"><article><span>🌿</span><strong>Spasi 3 paketa hrane</strong><p>2 od 3 preuzimanja</p><i><em style={{ width: "66%" }}/></i><b>+200 poena</b></article><article><span>♡</span><strong>Podrži lokalne firme</strong><p>Zaprati 2 firme ove nedelje</p><i><em style={{ width: "50%" }}/></i><b>+50 poena</b></article></div></section>
    <section className="rewards-section"><div className="section-title"><div><p>TVAJA AKTIVNOST</p><h2>Istorija poena</h2></div><a href="/profile">Profil</a></div><div className="reward-history">{activities.map(([title, points, detail]) => <article key={title}><span><Icon name="sparkle" size={17}/></span><div><strong>{title}</strong><p>{detail}</p></div><b>{points}</b></article>)}</div></section>
    <section className="referral-card"><span>POZOVI PRIJATELJE</span><h2>Zajedno otkrivamo više.</h2><p>Podeli svoj Balkan kod i oboje dobijate po 100 poena nakon prve aktivnosti.</p><div><code>BW-MARKO-365</code><Button variant="secondary">Podeli kod</Button></div></section>
  </section></AppShell>;
}

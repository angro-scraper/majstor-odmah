import "./super-app-home.css";

function Icon({ name, size = 16 }: { name: string; size?: number }) {
  const symbols: Record<string, string> = { sparkle: "✦", chevron: "›", shield: "◈", map: "⌖", utensils: "♨", car: "▱", house: "⌂", heart: "♥", scan: "⌗", receipt: "▤", card: "▣", more: "•••", bell: "♧", grid: "⊞", sliders: "≡", search: "⌕", settings: "⚙", activity: "◌", phone: "◔", star: "★", message: "◌", home: "⌂", user: "●", send: "➤" };
  return <span className="super-glyph" style={{ fontSize: size, lineHeight: 1 }} aria-hidden="true">{symbols[name] ?? "•"}</span>;
}

const categories = [
  ["Hrana", "Restorani, dostava i ponude", "utensils"],
  ["Auto", "Servisi, delovi i prevoz", "car"],
  ["Dom", "Majstori i kućne usluge", "house"],
  ["Zdravlje", "Lekari, klinike i apoteke", "heart"],
] as const;

const serviceRows = [
  ["Dom i majstori", "Popravke, instalacije i održavanje", "house"],
  ["Čišćenje i održavanje", "Domaćice, nega i svakodnevna pomoć", "sparkle"],
  ["Lepota i nega", "Frizeri, kozmetika i masaža", "heart"],
] as const;

export default function HomePage() {
  return <main className="super-app-site">
    <header className="super-app-header">
      <a className="super-brand" href="/" aria-label="Balkan.works početna"><span className="super-brand-mark">b</span><span>balkan<span>.works</span></span></a>
      <nav aria-label="Glavna navigacija"><a className="active" href="/">Početna</a><a href="/search">Usluge</a><a href="/dashboard">Poslovi</a><a href="/profile">Novčanik</a></nav>
      <a className="super-header-cta" href="/ai">Otvori aplikaciju <Icon name="chevron" size={16} /></a>
    </header>

    <section className="super-app-hero">
      <div className="super-app-copy">
        <span className="super-eyebrow"><Icon name="sparkle" size={15} /> BALKAN AI · LOKALNO I PAMETNO</span>
        <h1>Sve usluge<br /><span>na jednom mestu.</span></h1>
        <p>Jedna moderna aplikacija za svakodnevni život i poslovanje širom Balkana — brzo, lokalno i pouzdano.</p>
        <div className="super-principles">
          <div><span><Icon name="shield" size={19} /></span><p><b>Jedna prijava</b>Pristupi svim uslugama sa jednim nalogom.</p></div>
          <div><span><Icon name="map" size={19} /></span><p><b>Lokalno. Regionalno. Vaše.</b>Pronađi firme, ponude i prilike u svom gradu.</p></div>
          <div><span><Icon name="sparkle" size={19} /></span><p><b>Pametno personalizovano</b>AI preporuke prilagođene tvojoj potrebi.</p></div>
        </div>
        <div className="super-hero-actions"><a className="super-primary" href="/ai">Pitaj Balkan AI <Icon name="sparkle" size={17} /></a><a className="super-secondary" href="/search">Istraži usluge</a></div>
      </div>

      <div className="phone-stage" aria-label="Prikaz Balkan.works aplikacije">
        <article className="phone phone-home">
          <div className="phone-status"><span>9:41</span><i /><i /><i /></div>
          <div className="phone-logo"><span className="mini-mark">b</span> balkan<span>.works</span><Icon name="bell" size={15} /></div>
          <div className="mini-wallet"><small>Ukupno stanje</small><strong>12.450,00 <em>RSD</em></strong><div><b>＋ Dodaj novac</b><b>↗ Pošalji</b></div></div>
          <div className="mini-section-head"><b>Brze akcije</b><a href="/profile">Uredi</a></div>
          <div className="mini-actions"><span><Icon name="scan" size={17} />Skeniraj QR</span><span><Icon name="receipt" size={17} />Plati račun</span><span><Icon name="card" size={17} />Dodaj karticu</span><span><Icon name="more" size={17} />Još</span></div>
          <div className="mini-section-head"><b>Kategorije</b></div>
          <div className="mini-category-grid">{categories.map(([name, , icon]) => <a href="/search" key={name}><Icon name={icon} size={18} /><small>{name}</small></a>)}</div>
          <div className="mini-offer"><span>Wolt+ popust 20%<br />na prvu narudžbinu</span><Icon name="utensils" size={31} /></div>
          <PhoneNav active="Početna" />
        </article>

        <article className="phone phone-services">
          <div className="phone-status"><span>9:41</span><i /><i /><i /></div>
          <h2>Usluge</h2><div className="mini-search"><Icon name="search" size={14} />Pretražite usluge...<Icon name="sliders" size={14} /></div>
          <div className="mini-section-head"><b>Popularno</b><a href="/search">Prikaži sve</a></div>
          <div className="mini-popular"><span><Icon name="house" size={18} />Majstor za sve</span><span><Icon name="sparkle" size={18} />Čišćenje doma</span><span><Icon name="heart" size={18} />Lepota i nega</span><span><Icon name="car" size={18} />Prevoz</span></div>
          <div className="mini-section-head"><b>Sve kategorije</b></div>
          <div className="mini-list">{serviceRows.map(([title, desc, icon]) => <a href="/search" key={title}><span><Icon name={icon} size={16} /></span><div><b>{title}</b><small>{desc}</small></div><Icon name="chevron" size={14} /></a>)}</div>
          <PhoneNav active="Usluge" />
        </article>

        <article className="phone phone-ai">
          <div className="phone-status"><span>9:41</span><i /><i /><i /></div>
          <div className="ai-phone-head"><span className="ai-bot"><Icon name="sparkle" size={16} /></span><b>Balkan AI</b><Icon name="settings" size={15} /></div>
          <div className="ai-phone-copy"><h2>Kako mogu pomoći?</h2><p>Reci šta ti treba, a Balkan AI pronalazi najbolji put do rešenja.</p></div>
          <div className="chat-bubble bot">Zdravo! Tu sam da pronađem lokalnu uslugu koja ti stvarno odgovara.</div>
          <div className="chat-bubble user">Treba mi dobar servis za auto blizu mene.</div>
          <div className="chat-bubble bot">Našao sam proverene servise sa dobrim ocenama i brzim terminima.</div>
          <a className="ai-result-card" href="/ai"><span><Icon name="car" size={18} /></span><div><b>Premium Auto Servis</b><small>4.9 · 1.5 km · Verifikovano</small></div><strong>AI izbor</strong></a>
          <div className="chat-input">Napišite poruku... <span><Icon name="send" size={15} /></span></div>
          <PhoneNav active="AI" />
        </article>

        <article className="phone phone-dashboard">
          <div className="phone-status"><span>9:41</span><i /><i /><i /></div>
          <div className="dash-greeting"><small>DOBRODOŠLI</small><h2>Vaši rezultati danas</h2><a href="/dashboard">Dashboard <Icon name="chevron" size={13} /></a></div>
          <div className="metric-grid"><div><Icon name="activity" size={18} /><small>Pregledi</small><b>1.240</b><em>+12%</em></div><div><Icon name="phone" size={18} /><small>Kontakti</small><b>86</b><em>+8%</em></div><div><Icon name="star" size={18} /><small>Ocena</small><b>4.9</b><em>odlično</em></div><div><Icon name="heart" size={18} /><small>Sačuvano</small><b>320</b><em>+24%</em></div></div>
          <div className="dashboard-growth"><span><Icon name="sparkle" size={18} /></span><div><b>AI savet za rast</b><p>Dodajte još fotografija da povećate interesovanje.</p></div></div>
          <div className="dash-action"><Icon name="settings" size={17} /><span>Poboljšaj profil</span><Icon name="chevron" size={14} /></div>
          <div className="dash-action"><Icon name="sparkle" size={17} /><span>Promoviši firmu</span><Icon name="chevron" size={14} /></div>
          <PhoneNav active="Profil" />
        </article>
      </div>
    </section>

    <section className="super-proof"><div><span><Icon name="sparkle" size={25} /></span><b>Moderan dizajn</b><p>Intuitivno iskustvo i čist, moderan izgled.</p></div><div><span><Icon name="grid" size={25} /></span><b>Sve na jednom mestu</b><p>Usluge, ponude i poslovni alati u jednoj aplikaciji.</p></div><div><span><Icon name="shield" size={25} /></span><b>Sigurno i brzo</b><p>Jasne informacije, proverene firme i kontrola podataka.</p></div><div><span><Icon name="message" size={25} /></span><b>Podrška 24/7</b><p>Balkan AI i tim podrške su dostupni kada zatreba.</p></div></section>
  </main>;
}

function PhoneNav({ active }: { active: string }) {
  return <nav className="phone-nav" aria-label="Navigacija aplikacije"><span className={active === "Početna" ? "active" : ""}><Icon name="home" size={14} />Početna</span><span className={active === "Usluge" ? "active" : ""}><Icon name="grid" size={14} />Usluge</span><span className={active === "AI" ? "active ai" : "ai"}><Icon name="sparkle" size={16} />AI</span><span><Icon name="message" size={14} />Poruke</span><span className={active === "Profil" ? "active" : ""}><Icon name="user" size={14} />Profil</span></nav>;
}

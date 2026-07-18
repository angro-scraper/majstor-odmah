const queues = [
  ["Verifikacije firmi", "12", "Pregledajte nove zahteve i dokumentaciju."],
  ["Moderacija sadržaja", "7", "Recenzije i prijavljeni sadržaj čekaju odluku."],
  ["Zahtevi za privatnost", "3", "Izvoz i brisanje podataka u propisanom roku."],
];

export default function AdminHome() {
  return (
    <main className="shell">
      <aside className="sidebar">
        <a className="brand" href="/">balkan<span>.works</span></a>
        <p className="section-label">OPERATIONS</p>
        <nav aria-label="Administracija">
          <a className="active" href="/">Pregled</a>
          <a href="/">Firme</a><a href="/">Korisnici</a><a href="/">Moderacija</a>
          <a href="/">Analitika</a><a href="/">Bezbednost</a>
        </nav>
        <div className="account"><strong>Administrator</strong><span>Sigurna sesija</span></div>
      </aside>
      <section className="content">
        <header><div><p className="eyebrow">KONTROLNI CENTAR</p><h1>Dobar dan, tim.</h1><p>Pregled platforme i operativnih prioriteta za danas.</p></div><button>Nova objava</button></header>
        <div className="stats" aria-label="Platformske metrike">
          <article><span>Aktivni korisnici</span><strong>12.480</strong><small>+8,4% ove nedelje</small></article>
          <article><span>Verifikovane firme</span><strong>3.204</strong><small>+46 ove nedelje</small></article>
          <article><span>Uspešne konekcije</span><strong>1.286</strong><small>+12,1% danas</small></article>
        </div>
        <section className="panel"><div className="panel-heading"><div><p className="eyebrow">PRIORITETI</p><h2>Operativni red</h2></div><a href="/">Otvori sve</a></div>{queues.map(([title, count, note]) => <article className="queue" key={title}><div className="count">{count}</div><div><h3>{title}</h3><p>{note}</p></div><button className="ghost">Pregled</button></article>)}</section>
      </section>
    </main>
  );
}

import { AppShell } from "../src/components/app-shell";
import { BusinessCard } from "../src/components/business-card";
import { Badge } from "../src/components/ui";
import { businesses, categoryCards } from "../src/lib/demo-data";

export default function HomePage() {
  return (
    <AppShell active="Home">
      <section className="home-hero">
        <Badge tone="ai">✦ BALKAN AI</Badge>
        <p className="greeting">Dobrodošao, Marko 👋</p>
        <h1>Šta ti treba danas?</h1>
        <p className="hero-support">
          Opiši potrebu svojim rečima, a Balkan AI pronalazi lokalno rešenje.
        </p>
        <a className="search-cta ai-search-cta" href="/ai">
          ⌕ <span>Treba mi servis za auto blizu mene</span>
          <b>✦</b>
        </a>
        <div className="ai-prompt">
          <span>✦ AI predlog</span>
          <a href="/ai">„Nađi mi dobar restoran za večeru blizu mene“ →</a>
        </div>
      </section>
      <section className="screen-section">
        <div className="section-title">
          <div>
            <p>POPULARNO DANAS</p>
            <h2>Istraži grad</h2>
          </div>
          <a href="/discover">Otkrij sve</a>
        </div>
        <div className="category-grid category-visual-grid">
          {categoryCards.map((category) => (
            <a
              href="/search"
              className="category-chip category-visual-card"
              key={category.name}
            >
              <span>{category.icon}</span>
              <strong>{category.name}</strong>
              <small>{category.caption}</small>
            </a>
          ))}
        </div>
      </section>
      <section className="screen-section">
        <div className="section-title">
          <div>
            <p>ZA TEBE</p>
            <h2>Preporučeno u blizini</h2>
          </div>
          <a href="/ai">Vidi AI izbor</a>
        </div>
        <div className="business-list">
          {businesses.slice(0, 2).map((business) => (
            <BusinessCard business={business} key={business.id} />
          ))}
        </div>
      </section>
      <p className="demo-notice">
        Demo prikaz · stvarne fotografije, dostupnost i preporuke dolaze iz
        API-ja.
      </p>
    </AppShell>
  );
}

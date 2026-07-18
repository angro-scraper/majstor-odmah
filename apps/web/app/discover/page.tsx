import { AppShell } from "../../src/components/app-shell";
import { BusinessCard } from "../../src/components/business-card";
import { Badge } from "../../src/components/ui";
import { businesses, categoryCards } from "../../src/lib/demo-data";

export default function DiscoverPage() {
  return (
    <AppShell active="Discover">
      <section className="page-heading discover-heading">
        <Badge tone="ai">✦ PERSONALIZOVANO</Badge>
        <h1>Otkrij novo u svom gradu.</h1>
        <span>
          Popularne firme, lokalne usluge i predlozi zasnovani na tvojim
          interesovanjima.
        </span>
      </section>
      <section className="screen-section compact">
        <div className="discover-topic-row">
          {categoryCards.slice(0, 4).map((category) => (
            <a href="/search" key={category.name}>
              {category.icon} {category.name}
            </a>
          ))}
        </div>
        <div className="section-title">
          <div>
            <p>U TVOJOJ BLIZINI</p>
            <h2>Vredi posetiti</h2>
          </div>
          <a href="/search">Svi rezultati</a>
        </div>
        <div className="business-list">
          {businesses.map((business) => (
            <BusinessCard business={business} key={business.id} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}

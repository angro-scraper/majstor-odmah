import { AppShell } from "../../src/components/app-shell";
import { BusinessCard } from "../../src/components/business-card";
import { businesses } from "../../src/lib/demo-data";
export default function FavoritesPage() { return <AppShell active="Saved"><section className="page-heading"><p>SAČUVANO</p><h1>Tvoja lokalna lista</h1><p>Vrati se firmama koje želiš da kontaktiraš kasnije.</p></section><section className="screen-section compact"><div className="business-list">{businesses.slice(0, 2).map((business) => <BusinessCard business={business} key={business.id} />)}</div></section></AppShell>; }

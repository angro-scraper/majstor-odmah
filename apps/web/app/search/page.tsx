import { AppShell } from "../../src/components/app-shell";
import { BusinessCard } from "../../src/components/business-card";
import { businesses } from "../../src/lib/demo-data";

export default function SearchPage() { return <AppShell active="Discover"><section className="page-heading"><p>DISCOVER</p><h1>Rezultati u tvojoj blizini</h1><div className="filter-row"><button>⌖ Lokacija</button><button>☷ Kategorija</button><button>★ Ocena</button><button>◷ Otvoreno</button></div></section><section className="screen-section compact"><div className="sort-row"><span>12 rezultata</span><button>Sortiraj: Najbolje ↓</button></div><div className="business-list">{businesses.map((business) => <BusinessCard business={business} key={business.id} />)}</div></section></AppShell>; }

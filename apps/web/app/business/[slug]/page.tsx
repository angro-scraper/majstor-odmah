import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "../../../src/components/app-shell";
import { Badge, Button } from "../../../src/components/ui";
import { Rating, ReviewCard, ServiceCard } from "../../../src/components/business-details";

type PublicBusiness = {
  id: string; name: string; slug: string | null; description: string | null; phone: string | null; email: string | null; website: string | null;
  verificationStatus: string; category: { name: string } | null;
  locations: Array<{ address: string | null; city: { name: string } }>;
  services: Array<{ id: string; name: string; description: string | null; priceRange: string | null }>;
  reviews: Array<{ id: string; rating: number; comment: string | null; createdAt: string }>;
  _count: { reviews: number; favorites: number };
};

const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1").replace(/\/$/, "");

async function getBusiness(slug: string): Promise<PublicBusiness | null> {
  const response = await fetch(`${apiBase}/businesses/slug/${encodeURIComponent(slug)}`, { cache: "no-store" });
  if (!response.ok) return null;
  const body = await response.json() as { success: boolean; data?: PublicBusiness };
  return body.success ? body.data ?? null : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const business = await getBusiness((await params).slug);
  if (!business) return { title: "Firma | Balkan.works" };
  const city = business.locations[0]?.city.name;
  return {
    title: `${business.name}${city ? ` u ${city}` : ""} | Balkan.works`,
    description: business.description ?? `Pogledaj profil firme ${business.name} na Balkan.works.`,
  };
}

export default async function PublicBusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const business = await getBusiness((await params).slug);
  if (!business) notFound();
  const averageRating = business.reviews.length
    ? business.reviews.reduce((total, review) => total + review.rating, 0) / business.reviews.length
    : 0;
  const city = business.locations[0]?.city.name;
  const jsonLd = {
    "@context": "https://schema.org", "@type": "LocalBusiness", name: business.name, description: business.description,
    telephone: business.phone, email: business.email, url: business.website,
    address: business.locations[0] ? { "@type": "PostalAddress", streetAddress: business.locations[0].address, addressLocality: city } : undefined,
    aggregateRating: business._count.reviews > 0 ? { "@type": "AggregateRating", ratingValue: averageRating || undefined, reviewCount: business._count.reviews } : undefined,
  };

  return <AppShell active="services">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <section className="profile-cover">
      <div className="cover-pattern" />
      <div className="profile-identity"><div className="profile-logo">{business.name.slice(0, 2).toUpperCase()}</div><div>
        {business.verificationStatus === "VERIFIED" && <Badge tone="success">✓ Verifikovano</Badge>}
        <h1>{business.name}</h1>{business._count.reviews > 0 ? <Rating value={averageRating} count={business._count.reviews} /> : <p>Još nema javnih ocena</p>}<p>{business.category?.name ?? "Lokalna usluga"}</p>
      </div></div>
      <div className="profile-actions">
        {business.phone && <a href={`tel:${business.phone}`}><Button>Pozovi</Button></a>}
        {business.email && <a href={`mailto:${business.email}`}><Button variant="secondary">Pošalji e-mail</Button></a>}
        {business.locations[0]?.address && <Button variant="secondary">{city ?? "Lokacija"}</Button>}
      </div>
    </section>
    <section className="profile-content">
      <article className="trust-section"><p className="label">POVERENJE ZAJEDNICE</p><div className="trust-grid"><div><strong>{business._count.reviews}</strong><span>recenzija</span></div><div><strong>{business._count.favorites}</strong><span>sačuvano</span></div><div><strong>{business.verificationStatus === "VERIFIED" ? "✓" : "—"}</strong><span>{business.verificationStatus === "VERIFIED" ? "verifikovano" : "u proveri"}</span></div></div></article>
      <article><p className="label">O FIRMI</p><h2>Lokalna usluga, dostupna kada ti treba.</h2><p>{business.description ?? "Firma još nije dodala detaljan opis."}</p>{business.locations[0] && <p className="meta">📍 {business.locations[0].address ?? city}</p>}</article>
      <article><p className="label">USLUGE</p><div className="service-grid">{business.services.length ? business.services.map(service => <ServiceCard key={service.id} title={service.name} description={service.description ?? service.priceRange ?? "Detalji dostupni kontaktiranjem firme."} />) : <p>Firma uskoro dodaje svoje usluge.</p>}</div></article>
      <article className="ai-summary"><span>✦ Balkan AI sažetak</span><p>{business._count.reviews ? `Na osnovu ${business._count.reviews} recenzija, ovaj profil ima prosečnu ocenu ${averageRating.toFixed(1)}.` : "Prvi utisci korisnika će se pojaviti ovde nakon odobrenih recenzija."}</p></article>
      <article><p className="label">RECENZIJE</p>{business.reviews.length ? business.reviews.map(review => <ReviewCard key={review.id} rating={review.rating} quote={review.comment ?? "Korisnik je ostavio ocenu bez komentara."} author="Verifikovani korisnik" />) : <p>Još nema odobrenih recenzija.</p>}</article>
    </section>
  </AppShell>;
}

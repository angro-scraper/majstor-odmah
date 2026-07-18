import { DemoBusiness } from "../lib/demo-data";
import { AIRecommendation } from "./ai-components";
import { Rating } from "./business-details";
import { Badge } from "./ui";

export function BusinessCard({ business }: { business: DemoBusiness }) {
  return <article className="business-card"><div className="business-image"><span>{business.initials}</span><small>{business.category}</small></div><div className="business-card-body"><div className="card-title"><div><h3>{business.name}</h3><Rating value={business.rating} count={business.reviews} /></div>{business.verified && <Badge tone="success">✓ Verifikovano</Badge>}</div><p className="meta">⌖ {business.distance} · {business.city} · <b>{business.open ? "Otvoreno sada" : "Zatvoreno"}</b></p><AIRecommendation reason={business.aiReason} /><div className="card-actions"><a href="/businesses">Pogledaj profil</a><a className="contact-link" href={`tel:${business.phone}`}>Kontakt</a></div></div></article>;
}

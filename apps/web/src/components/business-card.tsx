import { DemoBusiness } from "../lib/demo-data";
import { AIRecommendation } from "./ai-components";
import { Rating } from "./business-details";
import { Badge } from "./ui";
import { Icon } from "./icons";

export function BusinessCard({ business }: { business: DemoBusiness }) {
  const href = business.href ?? "/businesses";
  return <article className="business-card">
    <a className={`business-image image-${business.accent}`} href={href} aria-label={`Otvori profil firme ${business.name}`}>
      <span>{business.initials}</span><small>{business.category}</small>
    </a>
    <div className="business-card-body">
      <div className="card-title"><div><h3>{business.name}</h3><Rating value={business.rating} count={business.reviews} /></div><div className="card-badges">{business.featured && <Badge tone="premium">Premium</Badge>}{business.verified && <Badge tone="success" icon="check">Verifikovano</Badge>}</div></div>
      <p className="meta"><Icon name="pin" size={14}/>{business.distance} · {business.city}<b>{business.open ? "Otvoreno sada" : "Zatvoreno"}</b></p>
      <AIRecommendation reason={business.aiReason} />
      <div className="card-actions"><a href={href}>Pogledaj profil</a><a className="contact-link" href={`tel:${business.phone}`}><Icon name="phone" />Kontakt</a></div>
    </div>
  </article>;
}

export function Rating({ value, count }: { value: number; count?: number | string }) {
  return <p className="rating" aria-label={`Ocena ${value} od 5`}>★★★★★ <strong>{value.toFixed(1)}</strong>{count !== undefined && <span> ({count})</span>}</p>;
}

export function ServiceCard({ title, description }: { title: string; description: string }) {
  return <div className="service-card"><span>↗</span><h3>{title}</h3><p>{description}</p></div>;
}

export function ReviewCard({ rating, quote, author }: { rating: number; quote: string; author: string }) {
  return <div className="review-card"><strong>{"★".repeat(rating)} {rating.toFixed(1)}</strong><p>“{quote}”</p><small>{author}</small></div>;
}

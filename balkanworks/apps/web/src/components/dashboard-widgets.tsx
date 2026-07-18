export function TrendChart({ label, value }: { label: string; value: string }) {
  return <div className="trend-chart"><span>{label}</span><strong>{value}</strong><svg viewBox="0 0 180 45" aria-label={`${label}: ${value}`} role="img"><path d="M2 38 C25 35 34 25 53 29 S84 40 101 20 S132 22 150 9 S169 14 178 3" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg></div>;
}

export function ActivityFeed({ items }: { items: string[] }) {
  return <ul className="activity-feed">{items.map((item) => <li key={item}><span>✦</span>{item}</li>)}</ul>;
}

import { FormEvent } from "react";
import { Input, Button } from "./ui";

export function AISearchBar({ query, onQueryChange, onSubmit }: { query: string; onQueryChange: (value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <form className="ai-search-bar" onSubmit={onSubmit}><Input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Napiši zahtev, npr. treba mi majstor danas" /><Button type="submit">Pitaj AI</Button></form>;
}

export function AIResponseCard() {
  return <div className="ai-answer"><span>✦ AI je razumeo</span><h2>Tražiš pouzdanu lokalnu uslugu blizu svoje lokacije.</h2><p>Rangirali smo opcije prema relevantnosti, oceni, verifikaciji i udaljenosti.</p></div>;
}

export function AIRecommendation({ reason }: { reason: string }) { return <p className="ai-reason">✦ {reason}</p>; }

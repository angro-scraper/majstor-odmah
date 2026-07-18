import { FormEvent } from "react";
import { Input, Button } from "./ui";
import { Icon } from "./icons";

export function AISearchBar({ query, onQueryChange, onSubmit }: { query: string; onQueryChange: (value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <form className="ai-search-bar" onSubmit={onSubmit}><label><Icon name="sparkle" size={18}/><Input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Napiši zahtev, npr. treba mi majstor danas" /></label><Button type="submit" icon="send">Pitaj AI</Button></form>;
}

export function AIResponseCard({ title = "Tražiš pouzdanu lokalnu uslugu blizu svoje lokacije.", explanation = "Rangirali smo opcije prema relevantnosti, oceni, verifikaciji i udaljenosti." }: { title?: string; explanation?: string }) {
  return <div className="ai-answer"><span><Icon name="sparkle" size={14}/> AI je razumeo</span><h2>{title}</h2><p>{explanation}</p></div>;
}

export function AIRecommendation({ reason }: { reason: string }) { return <p className="ai-reason"><Icon name="sparkle" size={14}/> {reason}</p>; }

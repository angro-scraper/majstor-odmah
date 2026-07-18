"use client";
import { FormEvent, useState } from "react";
import styles from "./contact.module.css";

const api = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1").replace(/\/$/, "");
export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setState("sending"); setError(""); const form = new FormData(event.currentTarget);
    try { const response = await fetch(`${api}/support/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) }); const body = await response.json(); if (!response.ok || !body.success) throw new Error(body.error?.message ?? "Poruka nije poslata."); setState("sent"); event.currentTarget.reset(); } catch (cause) { setError(cause instanceof Error ? cause.message : "Poruka nije poslata."); setState("error"); }
  }
  if (state === "sent") return <div className={styles.feedback}><h2>Poruka je poslata</h2><p>Hvala — naš tim će vam odgovoriti na email adresu koju ste ostavili.</p><button onClick={() => setState("idle")}>Pošalji novu poruku</button></div>;
  return <form onSubmit={submit} className={styles.form}><label>Ime i prezime<input name="name" required maxLength={120} placeholder="Marko Petrović" /></label><label>Email adresa<input name="email" type="email" required maxLength={254} placeholder="marko@primer.rs" /></label><label>Tema<select name="subject" defaultValue="GENERAL"><option value="GENERAL">Opšte pitanje</option><option value="SUPPORT">Podrška</option><option value="BUSINESS">Saradnja za kompanije</option><option value="REPORT">Prijava problema</option><option value="MEDIA">Mediji i partnerstva</option></select></label><label className={styles.hidden}>Website<input name="website" tabIndex={-1} autoComplete="off" /></label><label>Poruka<textarea name="message" required maxLength={5000} rows={6} placeholder="Napišite nam kako možemo da pomognemo..." /></label>{state === "error" && <p className={styles.error}>{error}</p>}<button disabled={state === "sending"}>{state === "sending" ? "Šaljemo..." : "Pošalji poruku"}</button></form>;
}

'use client'

import { useState } from 'react'
import { CheckCircle2, Send } from 'lucide-react'

const SUBJECTS = [
  'Opšte pitanje',
  'Podrška za korisnike',
  'Saradnja za kompanije',
  'Prijava problema',
  'Mediji i partnerstva',
]

export function ContactForm() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSent(true)
  }

  if (sent) {
    return (
      <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-border bg-secondary/60 px-6 py-12 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="size-7" />
        </span>
        <h3 className="text-lg font-semibold text-navy">Poruka je poslata</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Hvala što ste nam pisali. Naš tim će vam odgovoriti na email u roku od 24 sata radnim danima.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-2 text-sm font-semibold text-primary hover:underline"
        >
          Pošalji novu poruku
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-navy">
            Ime i prezime
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Marko Petrović"
            className="h-11 rounded-xl border border-border bg-background px-3.5 text-sm text-navy outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-navy">
            Email adresa
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="marko@primer.rs"
            className="h-11 rounded-xl border border-border bg-background px-3.5 text-sm text-navy outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="subject" className="text-sm font-medium text-navy">
          Tema
        </label>
        <select
          id="subject"
          name="subject"
          className="h-11 rounded-xl border border-border bg-background px-3.5 text-sm text-navy outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          defaultValue={SUBJECTS[0]}
        >
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-navy">
          Poruka
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Napišite nam kako možemo da pomognemo..."
          className="resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-navy outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-float transition hover:bg-primary/90"
      >
        <Send className="size-4" />
        Pošalji poruku
      </button>

      <p className="text-xs text-muted-foreground">
        Slanjem poruke prihvatate našu politiku privatnosti. Vaši podaci se koriste isključivo za odgovor na upit.
      </p>
    </form>
  )
}

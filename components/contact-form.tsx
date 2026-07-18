'use client'

import { useState } from 'react'
import { CheckCircle2, Send } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function ContactForm() {
  const { t } = useI18n()
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
        <h3 className="text-lg font-semibold text-navy">{t.contact.successTitle}</h3>
        <p className="max-w-sm text-sm text-muted-foreground">{t.contact.successBody}</p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-2 text-sm font-semibold text-primary hover:underline"
        >
          {t.contact.reset}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-navy">
            {t.contact.nameLabel}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder={t.contact.namePlaceholder}
            className="h-11 rounded-xl border border-border bg-background px-3.5 text-sm text-navy outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-navy">
            {t.contact.emailLabel}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder={t.contact.emailPlaceholder}
            className="h-11 rounded-xl border border-border bg-background px-3.5 text-sm text-navy outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="subject" className="text-sm font-medium text-navy">
          {t.contact.subjectLabel}
        </label>
        <select
          id="subject"
          name="subject"
          className="h-11 rounded-xl border border-border bg-background px-3.5 text-sm text-navy outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          defaultValue={t.contact.subjects[0]}
        >
          {t.contact.subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-navy">
          {t.contact.messageLabel}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder={t.contact.messagePlaceholder}
          className="resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-navy outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-float transition hover:bg-primary/90"
      >
        <Send className="size-4" />
        {t.contact.submit}
      </button>
    </form>
  )
}

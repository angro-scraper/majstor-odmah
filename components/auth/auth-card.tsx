'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/logo'

export function AuthCard({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter()
  const isRegister = mode === 'register'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Unesi ispravnu email adresu.')
    if (password.length < 8) return setError('Lozinka mora imati najmanje 8 karaktera.')
    if (isRegister && !name.trim()) return setError('Unesi svoje ime i prezime.')
    if (isRegister && password !== confirmPassword) return setError('Lozinke se ne podudaraju.')
    setSubmitting(true)
    window.localStorage.setItem('balkanworks-user', JSON.stringify({ name: name.trim() || 'Korisnik', email }))
    window.setTimeout(() => router.push('/app'), 350)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-secondary/60 to-background px-4 py-10">
      <div className="mx-auto w-full max-w-md"><Link href="/" className="inline-flex"><Logo /></Link><section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8"><p className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"><CheckCircle2 className="size-3.5" /> BALKAN ID</p><h1 className="mt-4 text-3xl font-bold text-navy">{isRegister ? 'Napravi svoj nalog' : 'Dobro došao/la nazad'}</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">{isRegister ? 'Jedan nalog za lokalne usluge, ponude, nagrade i poruke.' : 'Prijavi se da sačuvaš mesta, pratiš rezervacije i dobijaš lokalne preporuke.'}</p><form onSubmit={submit} className="mt-6 space-y-4">{isRegister ? <label className="block text-sm font-semibold text-navy">Ime i prezime<div className="relative mt-1.5"><UserRound className="pointer-events-none absolute left-3 top-3 size-5 text-muted-foreground" /><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Marko Marković" className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-3 text-sm outline-none focus:border-primary" /></div></label> : null}<label className="block text-sm font-semibold text-navy">Email adresa<div className="relative mt-1.5"><Mail className="pointer-events-none absolute left-3 top-3 size-5 text-muted-foreground" /><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ime@primer.com" className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-3 text-sm outline-none focus:border-primary" /></div></label><label className="block text-sm font-semibold text-navy">Lozinka<div className="relative mt-1.5"><LockKeyhole className="pointer-events-none absolute left-3 top-3 size-5 text-muted-foreground" /><input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Najmanje 8 karaktera" className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-3 text-sm outline-none focus:border-primary" /></div></label>{isRegister ? <label className="block text-sm font-semibold text-navy">Potvrdi lozinku<div className="relative mt-1.5"><LockKeyhole className="pointer-events-none absolute left-3 top-3 size-5 text-muted-foreground" /><input required type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Ponovi lozinku" className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-3 text-sm outline-none focus:border-primary" /></div></label> : null}{error ? <p role="alert" className="rounded-xl border border-destructive/25 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">{error}</p> : null}<button disabled={submitting} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60">{submitting ? 'Trenutak…' : isRegister ? 'Napravi nalog' : 'Prijavi se'}<ArrowRight className="size-4" /></button></form><p className="mt-5 text-center text-sm text-muted-foreground">{isRegister ? 'Već imaš nalog?' : 'Nemaš nalog?'} <Link href={isRegister ? '/prijava' : '/registracija'} className="font-semibold text-primary hover:underline">{isRegister ? 'Prijavi se' : 'Registruj se'}</Link></p></section><p className="mx-auto mt-5 max-w-sm text-center text-xs leading-5 text-muted-foreground">Nastavljanjem prihvataš uslove korišćenja i politiku privatnosti Balkan.works.</p></div>
    </main>
  )
}

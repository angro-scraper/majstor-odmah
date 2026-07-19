import Link from 'next/link'
import { ArrowRight, BarChart3, BadgeEuro, CircleDollarSign, Megaphone, Sparkles, TrendingUp } from 'lucide-react'

const products = [
  { icon: Megaphone, title: 'Istaknuta ponuda', description: 'Postavite akciju ispred relevantnih lokalnih kupaca.', price: 'od 12 €', action: 'Kreiraj ponudu', href: '/business/offers' },
  { icon: Sparkles, title: 'Premium profil', description: 'Veća vidljivost, verifikovani prikaz i napredna analitika.', price: '29 € / mes.', action: 'Izaberi paket', href: '/partneri/registracija' },
  { icon: CircleDollarSign, title: 'Plati po rezultatu', description: 'Naknada se obračunava samo za potvrđen kontakt ili rezervaciju.', price: 'od 0,50 €', action: 'Pogledaj učinak', href: '/business/analytics' },
]

export default function MonetizacijaPage() {
  return (
    <main className="space-y-8">
      <section className="rounded-[28px] border border-blue-100 bg-gradient-to-br from-blue-700 to-blue-500 p-7 text-white shadow-[0_18px_45px_rgba(37,99,235,0.22)] md:p-10">
        <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-blue-100"><BadgeEuro className="h-4 w-4" /> Rast i naplata</p>
        <h1 className="max-w-2xl text-3xl font-black tracking-tight md:text-5xl">Pretvorite vidljivost u stvarne rezultate.</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-blue-50">Birajte način na koji želite da rastete — kroz profil, lokalne reklame ili uspešno ostvarene kontakte.</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {products.map(({ icon: Icon, title, description, price, action, href }) => (
          <article key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><Icon className="h-6 w-6" /></div>
            <h2 className="mt-5 text-xl font-extrabold text-[#142f63]">{title}</h2>
            <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">{description}</p>
            <p className="mt-5 text-2xl font-black text-[#142f63]">{price}</p>
            <Link href={href} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700">{action}<ArrowRight className="h-4 w-4" /></Link>
          </article>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[['3.480', 'pregleda ovog meseca'], ['86', 'novih kontakata'], ['12,4%', 'stopa konverzije']].map(([value, label], index) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-2 text-sm text-slate-500">{index === 2 ? <TrendingUp className="h-4 w-4 text-emerald-500" /> : <BarChart3 className="h-4 w-4 text-blue-500" />}{label}</div><p className="mt-2 text-3xl font-black text-[#142f63]">{value}</p></div>
        ))}
      </section>
    </main>
  )
}

import Link from 'next/link'
import { ArrowRight, Clock3, Leaf, MapPin, PackageCheck, Star } from 'lucide-react'

const packages = [
  { id: '4', business: 'Pekara Jutro', title: 'Paket iznenađenja', original: '800 RSD', price: '220 RSD', distance: '0.6 km', pickup: 'Preuzimanje 19:00 – 20:30', remaining: '4 paketa' },
  { id: '5', business: 'Zeleni sto', title: 'Večernji obrok za dvoje', original: '1.400 RSD', price: '490 RSD', distance: '1.2 km', pickup: 'Preuzimanje 20:00 – 21:00', remaining: '2 paketa' },
  { id: '6', business: 'Komšijski market', title: 'Sveža korpa', original: '1.000 RSD', price: '350 RSD', distance: '1.8 km', pickup: 'Preuzimanje do 21:00', remaining: '6 paketa' },
]

export const metadata = { title: 'Sačuvaj hranu — balkan.works' }

export default function SaveFoodPage() {
  return (
    <div className="space-y-6 px-4 py-6 pb-24">
      <header>
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-turquoise"><Leaf className="size-4" /> SAČUVAJ HRANU</div>
        <h1 className="text-3xl font-bold text-navy">Dobra hrana, bolja cena</h1>
        <p className="mt-1 text-muted-foreground">Preuzmi kvalitetne pakete od lokalnih firmi i smanji bacanje hrane.</p>
      </header>

      <div className="rounded-2xl border border-border bg-secondary/60 p-4"><div className="flex items-start gap-3"><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-card text-turquoise"><PackageCheck className="size-5" /></div><div><p className="font-semibold text-navy">Kako funkcioniše?</p><p className="mt-1 text-sm text-muted-foreground">Rezerviši paket, preuzmi ga u navedenom terminu i potvrdi kodom u firmi.</p></div></div></div>

      <section className="space-y-3" aria-label="Dostupni paketi sačuvane hrane">
        {packages.map((item) => (
          <article key={item.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium text-muted-foreground">{item.business}</p><h2 className="mt-1 font-semibold text-navy">{item.title}</h2></div><span className="rounded-full bg-turquoise/10 px-2.5 py-1 text-xs font-semibold text-turquoise">{item.remaining}</span></div>
            <div className="mt-3 flex items-end gap-2"><span className="text-xl font-bold text-primary">{item.price}</span><span className="pb-0.5 text-sm text-muted-foreground line-through">{item.original}</span></div>
            <div className="mt-4 space-y-1.5 text-xs text-muted-foreground"><p className="inline-flex items-center gap-1"><MapPin className="size-3.5" />{item.distance}</p><p className="flex items-center gap-1"><Clock3 className="size-3.5" />{item.pickup}</p></div>
            <Link href={`/app/business/${item.id}`} className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground">Rezerviši paket <ArrowRight className="size-4" /></Link>
          </article>
        ))}
      </section>
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground"><Star className="size-4 text-primary" /> Posle preuzimanja oceni iskustvo i pomozi lokalnim firmama da budu još bolje.</div>
    </div>
  )
}

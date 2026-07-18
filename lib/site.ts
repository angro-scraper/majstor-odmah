import {
  Briefcase,
  Wrench,
  ShoppingBag,
  UtensilsCrossed,
  Plane,
  HeartPulse,
  GraduationCap,
  Building2,
  Wallet,
  Car,
  CalendarDays,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

export const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'Početna', href: '/' },
  { label: 'Usluge', href: '/usluge' },
  { label: 'Za korisnike', href: '/#kako-funkcionise' },
  { label: 'Za kompanije', href: '/za-kompanije' },
  { label: 'O nama', href: '/o-nama' },
  { label: 'Kontakt', href: '/kontakt' },
]

export type Category = {
  title: string
  description: string
  icon: LucideIcon
  accent: 'blue' | 'cyan' | 'teal'
}

export const CATEGORIES: Category[] = [
  {
    title: 'Poslovi',
    description: 'Oglasi za posao i honorarni angažmani širom regiona.',
    icon: Briefcase,
    accent: 'blue',
  },
  {
    title: 'Majstori i usluge',
    description: 'Provereni majstori za popravke, montažu i održavanje.',
    icon: Wrench,
    accent: 'cyan',
  },
  {
    title: 'Kupovina',
    description: 'Proizvodi lokalnih i regionalnih prodavaca na jednom mestu.',
    icon: ShoppingBag,
    accent: 'teal',
  },
  {
    title: 'Dostava hrane',
    description: 'Omiljeni restorani i brza dostava do vaših vrata.',
    icon: UtensilsCrossed,
    accent: 'blue',
  },
  {
    title: 'Putovanja',
    description: 'Letovi, hoteli i prevoz — rezervišite u par klikova.',
    icon: Plane,
    accent: 'cyan',
  },
  {
    title: 'Zdravlje',
    description: 'Zakazivanje pregleda kod lekara i klinika u blizini.',
    icon: HeartPulse,
    accent: 'teal',
  },
  {
    title: 'Edukacija',
    description: 'Kursevi, časovi i obuke za nova znanja i veštine.',
    icon: GraduationCap,
    accent: 'blue',
  },
  {
    title: 'Nekretnine',
    description: 'Stanovi, kuće i poslovni prostori za izdavanje i prodaju.',
    icon: Building2,
    accent: 'cyan',
  },
  {
    title: 'Finansije',
    description: 'Digitalni novčanik, plaćanja i transferi bez naknada.',
    icon: Wallet,
    accent: 'teal',
  },
  {
    title: 'Prevoz',
    description: 'Vožnje, selidbe i transport robe kad god vam zatreba.',
    icon: Car,
    accent: 'blue',
  },
  {
    title: 'Događaji',
    description: 'Ulaznice za koncerte, sport i dešavanja u vašem gradu.',
    icon: CalendarDays,
    accent: 'cyan',
  },
  {
    title: 'AI pomoćnik',
    description: 'Pametni asistent koji pronalazi rešenja umesto vas.',
    icon: Sparkles,
    accent: 'teal',
  },
]

export const COUNTRIES: { name: string; cities: string; code: string }[] = [
  { name: 'Srbija', cities: 'Beograd · Novi Sad · Niš', code: 'RS' },
  { name: 'Bosna i Hercegovina', cities: 'Sarajevo · Banja Luka · Mostar', code: 'BA' },
  { name: 'Hrvatska', cities: 'Zagreb · Split · Rijeka', code: 'HR' },
  { name: 'Crna Gora', cities: 'Podgorica · Budva · Nikšić', code: 'ME' },
  { name: 'Severna Makedonija', cities: 'Skoplje · Bitolj · Ohrid', code: 'MK' },
  { name: 'Slovenija', cities: 'Ljubljana · Maribor · Koper', code: 'SI' },
  { name: 'Albanija', cities: 'Tirana · Drač · Skadar', code: 'AL' },
  { name: 'Kosovo', cities: 'Priština · Prizren · Peć', code: 'XK' },
]

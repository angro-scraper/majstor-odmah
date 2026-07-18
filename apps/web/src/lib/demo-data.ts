import { IconName } from "../components/icons";

export type DemoBusiness = {
  id: string; name: string; category: string; city: string; distance: string;
  rating: number; reviews: number; open: boolean; verified: boolean; featured?: boolean;
  description: string; aiReason: string; phone: string; initials: string; accent: string; href?: string;
};

export type ServiceCategory = { name: string; icon: IconName; caption: string; tone: string; href: string };

export const businesses: DemoBusiness[] = [
  { id: "markovic", name: "Auto Servis Marković", category: "Auto servis", city: "Beograd", distance: "1,5 km", rating: 4.8, reviews: 124, open: true, verified: true, featured: true, description: "Dijagnostika, redovni servis i brze popravke uz jasan dogovor.", aiReason: "Preporučen zbog iskustva sa BMW vozilima.", phone: "+381115550101", initials: "AM", accent: "blue" },
  { id: "luma", name: "Studio Luma", category: "Lepota i nega", city: "Beograd", distance: "2,1 km", rating: 4.9, reviews: 89, open: true, verified: true, description: "Frizerske i beauty usluge sa slobodnim terminima ove nedelje.", aiReason: "Odgovara tvojoj lokaciji i interesovanjima.", phone: "+381115550102", initials: "SL", accent: "pink" },
  { id: "dunav", name: "Restoran Dunav", category: "Restorani", city: "Novi Sad", distance: "800 m", rating: 4.7, reviews: 202, open: false, verified: true, description: "Porodični restoran sa lokalnim jelima, parkingom i dnevnim menijem.", aiReason: "Dobro ocenjen za porodičnu večeru.", phone: "+381215550103", initials: "RD", accent: "orange" },
  { id: "zdravlje", name: "Klinika Vitalis", category: "Zdravlje", city: "Beograd", distance: "3,2 km", rating: 4.9, reviews: 156, open: true, verified: true, description: "Savremena dijagnostika i pregledi kod proverenih specijalista.", aiReason: "Dostupni termini ove nedelje.", phone: "+381115550104", initials: "KV", accent: "mint" },
];

export const categoryCards: ServiceCategory[] = [
  { name: "Poslovi", icon: "briefcase", caption: "Pronađi sledeću priliku", tone: "violet", href: "/poslovi" },
  { name: "Usluge", icon: "grid", caption: "Sve lokalne usluge", tone: "blue", href: "/usluge" },
  { name: "Kupovina", icon: "shopping", caption: "Ponude i prodavnice", tone: "orange", href: "/kupovina" },
  { name: "Dostava", icon: "utensils", caption: "Hrana iz tvog grada", tone: "pink", href: "/dostava" },
  { name: "Putovanja", icon: "plane", caption: "Letovi, hoteli i prevoz", tone: "sky", href: "/putovanja" },
  { name: "Zdravlje", icon: "heart", caption: "Lekari i klinike", tone: "mint", href: "/zdravlje" },
  { name: "Edukacija", icon: "graduation", caption: "Kursevi i škole", tone: "purple", href: "/edukacija" },
  { name: "Nekretnine", icon: "building", caption: "Dom i poslovni prostor", tone: "coral", href: "/nekretnine" },
  { name: "Majstori", icon: "house", caption: "Dom, popravke i radovi", tone: "yellow", href: "/majstori" },
  { name: "AI pomoćnik", icon: "sparkle", caption: "Pitaj i pronađi brže", tone: "ai", href: "/ai" },
];

export const quickActions = [
  { label: "Skeniraj QR", icon: "scan" as IconName },
  { label: "Plati račun", icon: "receipt" as IconName },
  { label: "Dodaj karticu", icon: "card" as IconName },
  { label: "Još", icon: "more" as IconName },
];

export const jobs = [
  { title: "Front-end Developer", company: "Nelt Group", place: "Beograd · Hibridno", pay: "2.000 – 3.000 €", type: "Puno radno vreme", fresh: true },
  { title: "Marketing specijalista", company: "Mosaic Studio", place: "Novi Sad · Hibridno", pay: "1.200 – 1.800 €", type: "Puno radno vreme", fresh: true },
  { title: "Vozač B kategorije", company: "Dostava Plus", place: "Beograd", pay: "900 – 1.100 €", type: "Smenski rad", fresh: false },
];

export const transactions = [
  { name: "Wolt", detail: "Dostava hrane", amount: "−1.250,00 RSD", icon: "utensils" as IconName, tone: "cyan" },
  { name: "Maxi", detail: "Kupovina", amount: "−2.435,50 RSD", icon: "shopping" as IconName, tone: "red" },
  { name: "Isplata na račun", detail: "Primljeno", amount: "+15.000,00 RSD", icon: "wallet" as IconName, tone: "green" },
  { name: "Telekom Srbija", detail: "Račun za telefon", amount: "−1.199,00 RSD", icon: "receipt" as IconName, tone: "purple" },
];

export const moduleContent: Record<string, { title: string; eyebrow: string; description: string; icon: IconName; accent: string; chips: string[]; primary: string; notice?: string }> = {
  usluge: { title: "Sve usluge", eyebrow: "LOKALNO I POUZDANO", description: "Pronađi proverene usluge u svom gradu, bez dugog pretraživanja.", icon: "grid", accent: "blue", chips: ["Najbliže", "Verifikovano", "Otvoreno sada"], primary: "Pretraži usluge" },
  poslovi: { title: "Poslovi", eyebrow: "SLEDEĆA PRILIKA", description: "Oglasi koje smo izdvojili prema tvom iskustvu i lokaciji.", icon: "briefcase", accent: "violet", chips: ["Preporučeni", "Novi", "Sačuvani"], primary: "Pretraži poslove" },
  novcanik: { title: "Novčanik", eyebrow: "FINANSIJE", description: "Jasan pregled sredstava, kartica i svakodnevnih plaćanja.", icon: "wallet", accent: "blue", chips: ["Kartice", "Računi", "Istorija"], primary: "Dodaj novac" },
  dostava: { title: "Dostava hrane", eyebrow: "BRZO I LOKALNO", description: "Restorani i ponude koje stižu do tvoje adrese.", icon: "utensils", accent: "orange", chips: ["Sve", "Pizza", "Burger", "Azijska"], primary: "Pogledaj restorane" },
  putovanja: { title: "Putovanja", eyebrow: "PLANIRAJ PUT", description: "Letovi, hoteli i prevoz na jednom mestu.", icon: "plane", accent: "sky", chips: ["Letovi", "Hoteli", "Autobusi", "Rent a car"], primary: "Pretraži ponude" },
  zdravlje: { title: "Zdravlje", eyebrow: "ZDRAVSTVENA NEGA", description: "Pronađi lekare, klinike i termine koji ti odgovaraju.", icon: "heart", accent: "mint", chips: ["Lekari", "Klinike", "Apoteke"], primary: "Zakaži pregled", notice: "Balkan.works ne zamenjuje stručni medicinski savet." },
  kupovina: { title: "Kupovina", eyebrow: "PONUDA U BLIZINI", description: "Uporedi lokalne prodavnice, brendove i aktuelne pogodnosti.", icon: "shopping", accent: "orange", chips: ["Popularno", "Novo", "Sačuvano"], primary: "Istraži ponude" },
  majstori: { title: "Majstori i dom", eyebrow: "POMOĆ ZA DOM", description: "Provereni majstori za hitne popravke i planirane radove.", icon: "house", accent: "yellow", chips: ["Električari", "Vodoinstalateri", "Klima"], primary: "Pronađi majstora" },
  edukacija: { title: "Edukacija", eyebrow: "UČI I NAPREDUJ", description: "Kursevi, škole i mentori iz tvog kraja.", icon: "graduation", accent: "purple", chips: ["Jezici", "IT", "Kursevi"], primary: "Pronađi kurs" },
  prevoz: { title: "Prevoz", eyebrow: "KRETANJE GRADOM", description: "Prevoz, rentiranje i lokalne usluge za vozila.", icon: "car", accent: "blue", chips: ["Taksi", "Rent a car", "Auto servis"], primary: "Pronađi prevoz" },
  nekretnine: { title: "Nekretnine", eyebrow: "DOM I PROSTOR", description: "Stanovi, kuće i poslovni prostori prilagođeni tvojim potrebama.", icon: "building", accent: "coral", chips: ["Izdavanje", "Kupovina", "Poslovni prostor"], primary: "Pretraži nekretnine" },
};

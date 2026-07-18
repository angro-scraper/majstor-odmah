export type DemoBusiness = { id: string; name: string; category: string; city: string; distance: string; rating: number; reviews: number; open: boolean; verified: boolean; description: string; aiReason: string; phone: string; initials: string };

export const businesses: DemoBusiness[] = [
  { id: "markovic", name: "Auto Servis Marković", category: "Auto", city: "Beograd", distance: "1.5 km", rating: 4.8, reviews: 124, open: true, verified: true, description: "Dijagnostika, redovni servis i brze popravke uz jasan dogovor.", aiReason: "Preporučeno zbog brzine i visokih ocena.", phone: "+381115550101", initials: "AM" },
  { id: "luma", name: "Studio Luma", category: "Beauty", city: "Beograd", distance: "2.1 km", rating: 4.9, reviews: 89, open: true, verified: true, description: "Frizerske i beauty usluge sa slobodnim terminima ove nedelje.", aiReason: "Odgovara tvojoj lokaciji i interesovanjima.", phone: "+381115550102", initials: "SL" },
  { id: "dunav", name: "Restoran Dunav", category: "Hrana", city: "Novi Sad", distance: "800 m", rating: 4.7, reviews: 202, open: false, verified: true, description: "Porodični restoran sa lokalnim jelima, parkingom i dnevnim menijem.", aiReason: "Dobro ocenjen za porodičnu večeru.", phone: "+381215550103", initials: "RD" },
];

export const categories = ["Hrana", "Auto", "Dom", "Zdravlje", "Beauty", "Usluge"];

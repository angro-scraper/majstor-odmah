import "./globals.css";

export const metadata = { title: "Balkan.works", description: "Pronađi pouzdane lokalne firme." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="sr"><body>{children}</body></html>;
}

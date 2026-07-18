import "./globals.css";
import "./design-tokens.css";
import "./wireframes.css";

export const metadata = { title: "Balkan.works", description: "Pronađi pouzdane lokalne firme." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="sr" data-theme="light"><body>{children}</body></html>;
}

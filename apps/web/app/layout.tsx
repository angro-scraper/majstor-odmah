import "./globals.css";
import "./design-tokens.css";
import "./wireframes.css";
import "./deals-save-food.css";

export const metadata = { title: "Balkan.works", description: "Sve usluge na jednom mestu — za svakodnevni život i poslovanje širom Balkana." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="sr" data-theme="light"><body>{children}</body></html>;
}

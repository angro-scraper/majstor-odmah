import type { Metadata } from "next"
import { PageShell } from "@/components/page-shell"
import { StoreButtons } from "@/components/store-buttons"
import { PhoneFrame } from "@/components/phone-frame"
import { HomeScreen } from "@/components/app-screens"
import { Check } from "lucide-react"

export const metadata: Metadata = {
  title: "Preuzmi aplikaciju",
  description:
    "Preuzmite balkan.works aplikaciju za iOS i Android i pristupite svim uslugama na jednom mestu.",
}

const points = [
  "Besplatno preuzimanje za iOS i Android",
  "Jedna prijava za sve usluge",
  "Podrška 24/7 na vašem jeziku",
]

export default function PreuzmiPage() {
  return (
    <PageShell pageKey="download">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <ul className="mb-8 flex flex-col gap-4">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-foreground">{p}</span>
              </li>
            ))}
          </ul>

          <StoreButtons />

          <div className="mt-8 flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-border bg-secondary">
              <div className="grid grid-cols-4 grid-rows-4 gap-0.5">
                {Array.from({ length: 16 }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-2.5 w-2.5 rounded-[2px] ${
                      [0, 1, 2, 4, 6, 8, 10, 11, 13, 15].includes(i)
                        ? "bg-navy"
                        : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-navy">Skenirajte za preuzimanje</p>
              <p className="text-sm text-muted-foreground">
                Uperite kameru telefona u QR kod da biste otvorili stranicu za preuzimanje.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <PhoneFrame>
            <HomeScreen />
          </PhoneFrame>
        </div>
      </div>
    </PageShell>
  )
}

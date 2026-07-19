import type { Metadata } from "next"
import { PageShell } from "@/components/page-shell"
import { PlatformAccess } from "@/components/platform-access"

export const metadata: Metadata = {
  title: "Pristup platformi",
  description:
    "Pristupite balkan.works platformi kao korisnik, firma ili partner.",
}

export default function PreuzmiPage() {
  return (
    <PageShell pageKey="download">
      <PlatformAccess />
    </PageShell>
  )
}

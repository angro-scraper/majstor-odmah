import { DemoBusiness } from "./demo-data";

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1").replace(/\/$/, "");

type ApiEnvelope<T> = { success: boolean; data: T; error?: { code: string; message: string } | null };

type ApiBusiness = {
  id: string;
  name: string;
  description?: string | null;
  phone?: string | null;
  category?: { name: string } | null;
  locations?: Array<{ city?: { name?: string } | null }>;
  _count?: { reviews?: number };
  verificationStatus?: "VERIFIED" | string;
};

export type AiSearchResult = {
  query: string;
  intent: { needs: string[]; urgency: "normal" | "urgent"; confidence: "low" | "medium" | "high" };
  explanation: string;
  results: ApiBusiness[];
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  const body = await response.json() as ApiEnvelope<T>;
  if (!response.ok || !body.success) throw new Error(body.error?.message ?? "API request failed");
  return body.data;
}

export const searchBusinesses = (query: string) => request<ApiBusiness[]>(`/search?query=${encodeURIComponent(query)}`);
export const aiSearch = (query: string) => request<AiSearchResult>("/ai/search", { method: "POST", body: JSON.stringify({ query }) });

export function toBusinessCard(business: ApiBusiness): DemoBusiness {
  const initials = business.name.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
  return {
    id: business.id,
    name: business.name,
    category: business.category?.name ?? "Lokalna usluga",
    city: business.locations?.[0]?.city?.name ?? "Balkan.works",
    distance: "U blizini",
    rating: 0,
    reviews: business._count?.reviews ?? 0,
    open: true,
    verified: business.verificationStatus === "VERIFIED",
    description: business.description ?? "Detalji firme su dostupni na profilu.",
    aiReason: "Rezultat odgovara tvojoj pretrazi.",
    phone: business.phone ?? "",
    initials: initials || "BW",
    accent: "blue",
  } as DemoBusiness;
}

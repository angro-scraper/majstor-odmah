export const REGIONAL_COUNTRIES = [
  { code: 'RS', name: 'Srbija', currency: 'RSD' },
  { code: 'HR', name: 'Hrvatska', currency: 'EUR' },
  { code: 'BA', name: 'Bosna i Hercegovina', currency: 'BAM' },
  { code: 'ME', name: 'Crna Gora', currency: 'EUR' },
  { code: 'SI', name: 'Slovenija', currency: 'EUR' },
  { code: 'MK', name: 'Severna Makedonija', currency: 'MKD' },
  { code: 'AL', name: 'Albanija', currency: 'ALL' },
] as const

export type RegionalCountryCode = (typeof REGIONAL_COUNTRIES)[number]['code']

export function formatCurrency(value: number, currency = 'RSD', locale = 'sr-RS') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 2 }).format(value)
}

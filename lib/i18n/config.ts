export const LOCALES = ['sr', 'hr', 'bs', 'cnr', 'mk', 'sl', 'sq', 'en', 'bg'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'sr'

export const LOCALE_META: Record<Locale, { label: string; native: string; short: string }> = {
  sr: { label: 'Srpski', native: 'Srpski', short: 'SR' },
  hr: { label: 'Hrvatski', native: 'Hrvatski', short: 'HR' },
  bs: { label: 'Bosanski', native: 'Bosanski', short: 'BS' },
  cnr: { label: 'Crnogorski', native: 'Crnogorski', short: 'ME' },
  mk: { label: 'Makedonski', native: 'Македонски', short: 'MK' },
  sl: { label: 'Slovenački', native: 'Slovenščina', short: 'SI' },
  sq: { label: 'Albanski', native: 'Shqip', short: 'AL' },
  en: { label: 'Engleski', native: 'English', short: 'EN' },
  bg: { label: 'Bugarski', native: 'Български', short: 'BG' },
}

export const STORAGE_KEY = 'bw-locale'

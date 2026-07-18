'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { LOCALES, DEFAULT_LOCALE, STORAGE_KEY, type Locale } from './config'
import { dictionaries } from './dictionaries'

type Dict = (typeof dictionaries)[typeof DEFAULT_LOCALE]

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Dict
}

const I18nContext = createContext<I18nContextValue | null>(null)

function isLocale(value: string | null): value is Locale {
  return value != null && (LOCALES as readonly string[]).includes(value)
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isLocale(stored)) {
      setLocaleState(stored)
      return
    }
    const nav = navigator.language.slice(0, 2).toLowerCase()
    if (isLocale(nav)) setLocaleState(nav)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore write errors (e.g. private mode)
    }
  }, [])

  const value: I18nContextValue = {
    locale,
    setLocale,
    t: dictionaries[locale],
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return ctx
}

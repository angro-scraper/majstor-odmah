import { ReactNode } from "react";
import { Icon, IconName } from "./icons";
import { ThemeToggle } from "./theme-toggle";

const links: { href: string; icon: IconName; label: string; key: string }[] = [
  { href: "/", icon: "home", label: "Početna", key: "home" },
  { href: "/usluge", icon: "grid", label: "Usluge", key: "services" },
  { href: "/ai", icon: "sparkle", label: "Brzo", key: "ai" },
  { href: "/discover", icon: "activity", label: "Aktivnost", key: "activity" },
  { href: "/profile", icon: "user", label: "Profil", key: "profile" },
];

export function Brand({ compact = false }: { compact?: boolean }) {
  return <a className={`brand ${compact ? "brand-compact" : ""}`} href="/" aria-label="Balkan.works početna"><span className="brand-mark"><span>b</span></span><span>balkan<span>.works</span></span></a>;
}

export function AppShell({ children, active = "home" }: { children: ReactNode; active?: string }) {
  return <main className="app-shell">
    <header className="app-topbar">
      <Brand />
      <div className="top-location"><Icon name="pin" size={16} /><span>Beograd, Vračar</span><Icon name="chevron" size={14} /></div>
      <div className="top-actions">
        <a className="top-icon-button" href="/notifications" aria-label="Obaveštenja"><Icon name="bell" size={19} /><i /></a>
        <ThemeToggle />
        <a className="business-link" href="/dashboard">Za firme</a>
      </div>
    </header>
    <section className="app-content">{children}</section>
    <nav className="bottom-nav" aria-label="Glavna navigacija">
      {links.map(({ href, icon, label, key }) => (
        <a className={`${key === active ? "active" : ""} ${key === "ai" ? "quick-nav" : ""}`} href={href} key={key} aria-current={key === active ? "page" : undefined}>
          <span><Icon name={icon} size={key === "ai" ? 22 : 20} /></span><em>{label}</em>
        </a>
      ))}
    </nav>
  </main>;
}

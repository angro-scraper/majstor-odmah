import { ReactNode } from "react";

const links = [["/", "⌂", "Home"], ["/search", "⌕", "Discover"], ["/ai", "✦", "AI"], ["/favorites", "♡", "Saved"], ["/profile", "◉", "Profile"]] as const;

export function AppShell({ children, active = "Home" }: { children: ReactNode; active?: string }) {
  return <main className="app-shell"><header className="app-topbar"><a className="brand" href="/">balkan<span>.works</span></a><div className="top-actions"><a href="/dashboard">Za firme</a><a href="/admin">Admin</a></div></header><section className="app-content">{children}</section><nav className="bottom-nav">{links.map(([href, icon, label]) => <a className={label === active ? "active" : ""} href={href} key={label}><span>{icon}</span>{label}</a>)}</nav></main>;
}

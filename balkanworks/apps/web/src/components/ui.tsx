import { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

export function Button({ className = "", children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) { return <button className={`button ${className}`} {...props}>{children}</button>; }
export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) { return <input className={`input ${className}`} {...props} />; }
export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "accent" }) { return <span className={`badge ${tone}`}>{children}</span>; }
export function Card({ className = "", children, ...props }: HTMLAttributes<HTMLElement>) { return <article className={`ui-card ${className}`} {...props}>{children}</article>; }
export function Avatar({ initials, label }: { initials: string; label: string }) { return <span className="avatar" aria-label={label} title={label}>{initials}</span>; }
export function Modal({ open, title, children }: { open: boolean; title: string; children: ReactNode }) { return open ? <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title}><section className="modal"><h2>{title}</h2>{children}</section></div> : null; }
export function Tabs({ items, active }: { items: string[]; active: string }) { return <div className="tabs" role="tablist">{items.map((item) => <button className={item === active ? "active" : ""} role="tab" aria-selected={item === active} key={item}>{item}</button>)}</div>; }
export function StatCard({ icon, label, value, detail }: { icon: string; label: string; value: string; detail?: string }) { return <article className="stat-card"><span className="stat-icon">{icon}</span><p>{label}</p><strong>{value}</strong>{detail && <small>{detail}</small>}</article>; }

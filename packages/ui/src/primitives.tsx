import type { ButtonHTMLAttributes, InputHTMLAttributes, PropsWithChildren } from "react";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) { return <button {...props} />; }
export function Input(props: InputHTMLAttributes<HTMLInputElement>) { return <input {...props} />; }
export function Card({ children }: PropsWithChildren) { return <section>{children}</section>; }
export function Badge({ children }: PropsWithChildren) { return <span>{children}</span>; }
export function Avatar({ name }: { name: string }) { return <span aria-label={name}>{name.slice(0, 1).toUpperCase()}</span>; }
export function Toast({ children }: PropsWithChildren) { return <output role="status">{children}</output>; }

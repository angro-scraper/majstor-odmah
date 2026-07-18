import { SVGProps, type ReactNode } from "react";

export type IconName =
  | "home" | "grid" | "sparkle" | "activity" | "user" | "search"
  | "bell" | "pin" | "chevron" | "wallet" | "send" | "scan"
  | "briefcase" | "utensils" | "car" | "house" | "heart" | "graduation"
  | "plane" | "shopping" | "building" | "shield" | "star" | "clock"
  | "sliders" | "plus" | "message" | "map" | "card" | "settings"
  | "calendar" | "stethoscope" | "receipt" | "more" | "check" | "phone";

const paths: Record<IconName, ReactNode> = {
  home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z"/><path d="M9 21v-7h6v7"/></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  sparkle: <path d="m12 2 1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9L12 2Zm7 13 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/>,
  activity: <path d="M3 12h4l2-7 4 14 2-7h6"/>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4.1 3.4-6 8-6s7.2 1.9 8 6"/></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
  bell: <><path d="M18 9a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 22h4"/></>,
  pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  wallet: <><path d="M3 7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a2 2 0 0 1-2 2H6a3 3 0 0 1-3-3V7Z"/><path d="M3 8h15a3 3 0 0 1 3 3v3h-5a2 2 0 1 1 0-4h5"/></>,
  send: <><path d="m21 3-7.5 18-3.7-7.8L3 9.5 21 3Z"/><path d="m9.8 13.2 5-4.9"/></>,
  scan: <><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M7 12h10"/></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/></>,
  utensils: <><path d="M4 3v8M7 3v8M4 7h3M5.5 11v10M15 3v18M15 3c4 0 5 3 5 6h-5"/></>,
  car: <><path d="m5 16 1.5-6h11l1.5 6"/><path d="M4 16h16v4H4z"/><circle cx="7" cy="20" r="1"/><circle cx="17" cy="20" r="1"/><path d="M8 10 9.5 6h5L16 10"/></>,
  house: <><path d="m3 11 9-8 9 8v10H3V11Z"/><path d="M9 21v-6h6v6"/></>,
  heart: <path d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 6l-1-1.2a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.4 1-1a5.5 5.5 0 0 0 0-7.8Z"/>,
  graduation: <><path d="m2 9 10-5 10 5-10 5L2 9Z"/><path d="M6 11v5c3 3 9 3 12 0v-5M22 9v6"/></>,
  plane: <path d="m22 2-7 20-4-9-9-4 20-7Zm-11 11 5-5"/>,
  shopping: <><path d="M4 5h16l-1 15H5L4 5Z"/><path d="M8 8a4 4 0 0 1 8 0"/></>,
  building: <><path d="M4 21V4h12v17M16 9h4v12M2 21h20M8 8h4M8 12h4M8 16h4"/></>,
  shield: <><path d="M12 3 4 6v5c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V6l-8-3Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></>,
  star: <path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1.1 6.2L12 17.4l-5.6 2.9 1.1-6.2L3 9.7l6.2-.9L12 3Z"/>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></>,
  sliders: <><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="7" cy="18" r="2"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  message: <path d="M20 15a4 4 0 0 1-4 4H9l-5 3v-7a4 4 0 0 1-1-3V7a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4v8Z"/>,
  map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/></>,
  card: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h3"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.4 2.4-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-3.5v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-2.4-2.4.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H4.2v-3.5h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.4-2.4.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.2h3.5v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.4 2.4-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2V14h-.2a1.7 1.7 0 0 0-1.5 1Z"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M8 14h2M14 14h2M8 18h2"/></>,
  stethoscope: <><path d="M6 3v6a4 4 0 0 0 8 0V3M6 5H4M14 5h2M10 13v3a4 4 0 0 0 8 0v-1"/><circle cx="18" cy="14" r="2"/></>,
  receipt: <path d="M5 3h14v18l-2-1.5-2 1.5-3-1.5L9 21l-2-1.5L5 21V3Zm4 5h6M9 12h6M9 16h3"/>,
  more: <><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/></>,
  check: <path d="m5 12 4.2 4.2L19 6.5"/>,
  phone: <path d="M7.2 3.7 9.6 7 8 8.8c1 2.2 2.8 4 5 5l1.8-1.6 3.3 2.4-1.2 3.8c-.3.8-1.1 1.3-1.9 1.1C8.3 18.1 5.9 15.7 4.5 9c-.2-.8.3-1.6 1.1-1.9l1.6-3.4Z"/>,
};

export function Icon({ name, size = 20, strokeWidth = 1.9, className = "", ...props }: SVGProps<SVGSVGElement> & { name: IconName; size?: number; strokeWidth?: number }) {
  return <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}

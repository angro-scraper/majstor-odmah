import { NextResponse, type NextRequest } from 'next/server'

const platformRoutes: Record<string, string> = {
  '/app': '/za-korisnike',
  '/app/discover': '/usluge',
  '/app/deals': '/usluge?tema=kupovina',
  '/app/save-food': '/usluge?tema=dostava',
  '/app/ai': '/platforma#ai-pomocnik',
  '/app/rewards': '/za-korisnike',
  '/app/saved': '/za-korisnike',
  '/app/profile': '/registracija',
  '/app/settings': '/registracija',
  '/app/wallet': '/za-kompanije',
  '/app/bookings': '/usluge',
  '/app/messages': '/za-korisnike',
  '/app/requests': '/usluge?tema=majstori',
}

export function proxy(request: NextRequest) {
  const target = platformRoutes[request.nextUrl.pathname] ?? '/za-korisnike'
  return NextResponse.redirect(new URL(target, request.url))
}

export const config = { matcher: ['/app/:path*'] }

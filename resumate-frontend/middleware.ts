import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// Routes that require an authenticated session
const protectedPrefixes = ['/dashboard']

async function verifySession(token: string | undefined) {
  if (!token) return null
  const secret = process.env.AUTH_SECRET
  if (!secret) return null
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret))
    // Our tokens (see issueSession) use custom claims: { uid, tv }
    // Fall back to standard "sub" & custom tokenVersion names for forward compatibility.
    const uid = (payload as any).uid || (typeof payload.sub === 'string' ? payload.sub : null)
    const tokenVersion = (payload as any).tv ?? (payload as any).tokenVersion ?? null
    if (typeof uid === 'string') {
      return { userId: uid, tokenVersion }
    }
  } catch {
    return null
  }
  return null
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (!protectedPrefixes.some(prefix => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  const token = req.cookies.get('session')?.value
  const session = await verifySession(token)
  if (!session) {
    const signInUrl = new URL('/auth/signin', req.url)
    signInUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(signInUrl)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}

import { SignJWT, jwtVerify, JWTPayload } from 'jose'
// @ts-ignore
import { cookies } from 'next/headers'

const JWT_SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret-change')
const ACCESS_TTL_MS = 1000 * 60 * 60 * 12 // 12h

export interface SessionPayload extends JWTPayload {
  uid: string
  tv: number // tokenVersion for invalidation
}

export async function issueSession(user: { id: string, tokenVersion: number }) {
  const expSec = Math.floor(Date.now() / 1000) + ACCESS_TTL_MS / 1000
  const token = await new SignJWT({ uid: user.id, tv: user.tokenVersion })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(expSec)
    .sign(JWT_SECRET)
  const cookieStore = await cookies()
  cookieStore.set({
    name: 'session',
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ACCESS_TTL_MS / 1000
  })
  return token
}

export async function readSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function revokeSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.set({ name: 'session', value: '', httpOnly: true, path: '/', maxAge: 0 })
}

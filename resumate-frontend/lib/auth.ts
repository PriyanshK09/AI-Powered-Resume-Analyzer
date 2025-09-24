import { usersCollection, ensureUserIndexes, UserDoc } from './mongo'
import crypto from 'crypto'
import { scrypt as _scrypt, randomBytes, timingSafeEqual, randomUUID } from 'crypto'
import { promisify } from 'util'
import { SignJWT, jwtVerify, JWTPayload } from 'jose'
// @ts-ignore
import { cookies } from 'next/headers'

const scrypt = promisify(_scrypt)

const JWT_SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret-change')
const ACCESS_TTL_MS = 1000 * 60 * 60 * 12 // 12h

export interface SessionPayload extends JWTPayload {
  uid: string
  tv: number // tokenVersion for invalidation
}

// Password hashing using Node's built-in scrypt for portability in serverless
// Format: scrypt:v1:<saltBase64>:<keyBase64>
const SCRYPT_PREFIX = 'scrypt:v1:'
export async function hashPassword(password: string) {
  const salt = randomBytes(16)
  const derived = (await scrypt(password, salt, 64)) as Buffer
  return `${SCRYPT_PREFIX}${salt.toString('base64')}:${derived.toString('base64')}`
}

export async function verifyPassword(stored: string, password: string) {
  if (stored.startsWith(SCRYPT_PREFIX)) {
    const [, rest] = stored.split(SCRYPT_PREFIX)
    const [saltB64, keyB64] = rest.split(':')
    if (!saltB64 || !keyB64) return false
    const salt = Buffer.from(saltB64, 'base64')
    const expected = Buffer.from(keyB64, 'base64')
    try {
      const derived = (await scrypt(password, salt, expected.length)) as Buffer
      return timingSafeEqual(derived, expected)
    } catch {
      return false
    }
  }
  // Backward compatibility: if legacy argon2 hash, try to verify when argon2 is available
  if (stored.startsWith('$argon2')) {
    try {
      const mod: any = await import('argon2')
      return await mod.verify(stored, password)
    } catch (e) {
      console.warn('argon2 not available to verify legacy hash; consider resetting password')
      return false
    }
  }
  return false
}

export async function createUser(email: string, password: string, name?: string) {
  await ensureUserIndexes()
  const col = await usersCollection()
  const passwordHash = await hashPassword(password)
  const now = new Date()
  const doc: UserDoc = {
    _id: crypto.randomUUID(),
    email: email.toLowerCase(),
    name: name || null,
    passwordHash,
    createdAt: now,
    updatedAt: now,
    resetToken: null,
    resetTokenExpiry: null,
    tokenVersion: 0
  }
  await col.insertOne(doc)
  return { id: doc._id, ...doc }
}

export async function findUserByEmail(email: string) {
  const col = await usersCollection()
  const user = await col.findOne({ email: email.toLowerCase() })
  return user ? { id: user._id, ...user } as any : null
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

export async function createResetToken(userId: string) {
  const raw = randomUUID()
  const hashed = await hashPassword(raw)
  const expiry = new Date(Date.now() + 1000 * 60 * 30)
  const col = await usersCollection()
  await col.updateOne({ _id: userId }, { $set: { resetToken: hashed, resetTokenExpiry: expiry, updatedAt: new Date() } })
  return raw
}

export async function useResetToken(email: string, token: string, newPassword: string) {
  const col = await usersCollection()
  const user = await col.findOne({ email: email.toLowerCase() })
  if (!user || !user.resetToken || !user.resetTokenExpiry) return false
  if (user.resetTokenExpiry.getTime() < Date.now()) return false
  const valid = await verifyPassword(user.resetToken, token)
  if (!valid) return false
  const passwordHash = await hashPassword(newPassword)
  const newVersion = (user.tokenVersion || 0) + 1
  await col.updateOne({ _id: user._id }, { $set: { passwordHash, resetToken: null, resetTokenExpiry: null, tokenVersion: newVersion, updatedAt: new Date() } })
  return true
}

// Basic in-memory rate limiting (per process) for demo; replace with Redis in production
const buckets = new Map<string, { count: number; reset: number }>()
export function rateLimit(key: string, limit = 10, windowMs = 60_000) {
  const now = Date.now()
  const bucket = buckets.get(key)
  if (!bucket || bucket.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs })
    return true
  }
  if (bucket.count >= limit) return false
  bucket.count++
  return true
}

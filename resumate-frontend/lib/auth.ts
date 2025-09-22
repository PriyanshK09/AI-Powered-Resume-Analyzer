import { usersCollection, ensureUserIndexes, UserDoc } from './mongo'
import crypto from 'crypto'
import argon2 from 'argon2'
import { SignJWT, jwtVerify, JWTPayload } from 'jose'
// @ts-ignore
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'

const JWT_SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret-change')
const ACCESS_TTL_MS = 1000 * 60 * 60 * 12 // 12h

export interface SessionPayload extends JWTPayload {
  uid: string
  tv: number // tokenVersion for invalidation
}

export async function hashPassword(password: string) {
  return argon2.hash(password, { type: argon2.argon2id })
}

export async function verifyPassword(hash: string, password: string) {
  try { return await argon2.verify(hash, password) } catch { return false }
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

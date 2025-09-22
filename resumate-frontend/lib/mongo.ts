import { MongoClient, Collection, Db } from 'mongodb'

function resolveMongoUri(): string {
  const raw = process.env.MONGODB_URI
  if (!raw) throw new Error('MONGODB_URI env var not set')
  const trimmed = raw.trim()
  if (!/^mongodb(\+srv)?:\/\//i.test(trimmed)) {
    throw new Error('MONGODB_URI has invalid scheme. Must start with mongodb:// or mongodb+srv://')
  }
  return trimmed
}

interface GlobalMongo {
  client?: MongoClient
  promise?: Promise<MongoClient>
}

const globalForMongo = globalThis as unknown as { _mongo?: GlobalMongo }

if (!globalForMongo._mongo) globalForMongo._mongo = {}

export async function getMongoClient(): Promise<MongoClient> {
  if (globalForMongo._mongo!.client) return globalForMongo._mongo!.client!
  if (!globalForMongo._mongo!.promise) {
    try {
      const uri = resolveMongoUri()
      globalForMongo._mongo!.promise = MongoClient.connect(uri)
    } catch (e) {
      // Reset promise so future attempts can retry
      globalForMongo._mongo!.promise = undefined
      throw e
    }
  }
  try {
    globalForMongo._mongo!.client = await globalForMongo._mongo!.promise!
  } catch (e) {
    globalForMongo._mongo!.promise = undefined
    throw e
  }
  return globalForMongo._mongo!.client!
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient()
  // Optional: allow MONGODB_DB override or derive from URI (mongodb+srv includes default db if provided after /)
  const dbName = process.env.MONGODB_DB || 'resumate'
  return client.db(dbName)
}

export interface UserDoc {
  _id: string
  email: string
  name?: string | null
  passwordHash: string
  createdAt: Date
  updatedAt: Date
  resetToken?: string | null
  resetTokenExpiry?: Date | null
  tokenVersion: number
}

export async function usersCollection(): Promise<Collection<UserDoc>> {
  const db = await getDb()
  return db.collection<UserDoc>('users')
}

// Ensure indexes (called lazily once)
let indexesCreated = false
export async function ensureUserIndexes() {
  if (indexesCreated) return
  const col = await usersCollection()
  await Promise.all([
    col.createIndex({ email: 1 }, { unique: true }),
    // Partial index ensures we only index documents that actually have a resetToken; sparse+partial together is invalid.
    col.createIndex(
      { resetToken: 1 },
      { partialFilterExpression: { resetToken: { $exists: true } } }
    )
  ])
  indexesCreated = true
}

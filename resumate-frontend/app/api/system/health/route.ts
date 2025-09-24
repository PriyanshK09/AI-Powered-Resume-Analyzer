import { NextResponse } from 'next/server'
import { getMongoClient } from '@/lib/mongo'

export const dynamic = 'force-dynamic'

export async function GET() {
  const diagnostics: Record<string, any> = {
    env: {
      AUTH_SECRET: Boolean(process.env.AUTH_SECRET),
      MONGODB_URI: Boolean(process.env.MONGODB_URI),
      MONGODB_DB: Boolean(process.env.MONGODB_DB),
    },
    db: { connected: false },
  }
  try {
    if (process.env.MONGODB_URI) {
      const client = await getMongoClient()
      diagnostics.db.connected = !!client
    }
  } catch (e: any) {
    diagnostics.db.error = e?.message || String(e)
  }
  return NextResponse.json(diagnostics)
}

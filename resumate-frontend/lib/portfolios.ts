import { getDb } from './mongo'
import { ObjectId } from 'mongodb'

export interface PortfolioDoc {
  _id: ObjectId | string
  userId: string
  title: string
  slug: string
  theme: 'modern' | 'minimal' | 'creative' | 'professional' | 'dark' | 'colorful'
  isPublic: boolean
  // Personal details
  fullName?: string
  tagline?: string
  bio?: string
  email?: string
  phone?: string
  location?: string
  // Social links
  linkedin?: string
  github?: string
  website?: string
  twitter?: string
  dribbble?: string
  behance?: string
  // Professional sections
  about?: string
  experience?: string
  projects?: string
  skills?: string
  education?: string
  achievements?: string
  testimonials?: string
  // Content sections
  services?: string
  contact?: string
  // SEO & Meta
  metaDescription?: string
  metaKeywords?: string
  createdAt: Date
  updatedAt: Date
  views?: number
}

// Database document interface (with ObjectId)
interface PortfolioDbDoc extends Omit<PortfolioDoc, '_id'> {
  _id: ObjectId
}

let portfolioIndexesCreated = false

export async function portfoliosCollection() {
  const db = await getDb()
  const col = db.collection<PortfolioDbDoc>('portfolios')
  if (!portfolioIndexesCreated) {
    await Promise.all([
      col.createIndex({ userId: 1, updatedAt: -1 }),
      col.createIndex({ slug: 1 }, { unique: true }),
      col.createIndex({ isPublic: 1, updatedAt: -1 }),
      col.createIndex({ userId: 1, title: 1 }),
    ])
    portfolioIndexesCreated = true
  }
  return col
}

export async function createPortfolio(userId: string, data: Omit<PortfolioDoc, '_id' | 'userId' | 'createdAt' | 'updatedAt' | 'views'>) {
  const col = await portfoliosCollection()
  
  // Check if slug already exists
  const existing = await col.findOne({ slug: data.slug })
  if (existing) {
    throw new Error('Portfolio URL already exists')
  }
  
  const now = new Date()
  const doc: Omit<PortfolioDbDoc, '_id'> = {
    ...data,
    userId,
    views: 0,
    createdAt: now,
    updatedAt: now,
  }
  
  const result = await col.insertOne(doc as any)
  return { ...doc, _id: result.insertedId.toString() }
}

export async function getPortfolio(userId: string, id: string) {
  const col = await portfoliosCollection()
  try {
    const objectId = ObjectId.isValid(id) ? new ObjectId(id) : null
    if (!objectId) return null
    
    const portfolio = await col.findOne({ _id: objectId, userId })
    return portfolio ? { ...portfolio, _id: portfolio._id.toString() } : null
  } catch (error) {
    console.error('getPortfolio error:', error)
    return null
  }
}

export async function getPortfolioBySlug(slug: string) {
  const col = await portfoliosCollection()
  const portfolio = await col.findOne({ slug, isPublic: true })
  return portfolio ? { ...portfolio, _id: portfolio._id.toString() } : null
}

export async function getUserPortfolios(userId: string, limit = 50) {
  const col = await portfoliosCollection()
  const portfolios = await col
    .find({ userId })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .toArray()
  
  return portfolios.map(p => ({ ...p, _id: p._id.toString() }))
}

export async function updatePortfolio(
  userId: string, 
  id: string, 
  data: Partial<Omit<PortfolioDoc, '_id' | 'userId' | 'createdAt' | 'updatedAt'>>
) {
  const col = await portfoliosCollection()
  
  try {
    const objectId = ObjectId.isValid(id) ? new ObjectId(id) : null
    if (!objectId) return null
    
    // If updating slug, check for conflicts
    if (data.slug) {
      const existing = await col.findOne({ slug: data.slug, _id: { $ne: objectId } })
      if (existing) {
        throw new Error('Portfolio URL already exists')
      }
    }
    
    const result = await col.findOneAndUpdate(
      { _id: objectId, userId },
      { 
        $set: { 
          ...data, 
          updatedAt: new Date() 
        } 
      },
      { returnDocument: 'after' }
    )
    
    return result ? { ...result, _id: result._id.toString() } : null
  } catch (error) {
    console.error('updatePortfolio error:', error)
    throw error
  }
}

export async function deletePortfolio(userId: string, id: string) {
  const col = await portfoliosCollection()
  try {
    const objectId = ObjectId.isValid(id) ? new ObjectId(id) : null
    if (!objectId) return false
    
    const result = await col.deleteOne({ _id: objectId, userId })
    return result.deletedCount > 0
  } catch (error) {
    console.error('deletePortfolio error:', error)
    return false
  }
}

export async function incrementPortfolioViews(slug: string) {
  const col = await portfoliosCollection()
  await col.updateOne(
    { slug, isPublic: true },
    { $inc: { views: 1 } }
  )
}

export async function checkSlugAvailability(slug: string, excludeId?: string) {
  const col = await portfoliosCollection()
  const query: any = { slug }
  if (excludeId) {
    const objectId = ObjectId.isValid(excludeId) ? new ObjectId(excludeId) : null
    if (objectId) {
      query._id = { $ne: objectId }
    }
  }
  const existing = await col.findOne(query)
  return !existing
}

export async function generateUniqueSlug(baseSlug: string, userId: string) {
  let slug = baseSlug
  let counter = 1
  
  while (!(await checkSlugAvailability(slug))) {
    slug = `${baseSlug}-${counter}`
    counter++
  }
  
  return slug
}
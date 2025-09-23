import { z } from 'zod'

export const emailSchema = z.string().email().max(255)
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(/[A-Z]/, 'Include an uppercase letter')
  .regex(/[a-z]/, 'Include a lowercase letter')
  .regex(/[0-9]/, 'Include a number')

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(2).max(80).optional()
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1)
})

export const forgotSchema = z.object({
  email: emailSchema
})

export const resetSchema = z.object({
  email: emailSchema,
  token: z.string().min(10),
  newPassword: passwordSchema
})

// Resume related validation
export const resumeCreateSchema = z.object({
  title: z.string().min(3).max(120),
  content: z.string().min(10).max(100_000), // raw JSON / markdown / structured blocks (future)
  targetRole: z.union([z.string().max(80), z.literal('')]).optional(),
  templateId: z.union([z.string().max(64), z.literal('')]).optional(),
  // Personal / contact details
  fullName: z.union([z.string().max(120), z.literal('')]).optional(),
  email: z.union([z.string().email().max(255), z.literal('')]).optional(),
  phone: z.union([z.string().max(40), z.literal('')]).optional(),
  location: z.union([z.string().max(120), z.literal('')]).optional(),
  linkedin: z.union([z.string().url().max(255), z.literal('')]).optional(),
  github: z.union([z.string().url().max(255), z.literal('')]).optional(),
  portfolio: z.union([z.string().url().max(255), z.literal('')]).optional(),
  website: z.union([z.string().url().max(255), z.literal('')]).optional(),
  // Professional sections
  summary: z.union([z.string().max(2_000), z.literal('')]).optional(),
  experience: z.union([z.string().max(50_000), z.literal('')]).optional(),
  projects: z.union([z.string().max(50_000), z.literal('')]).optional(),
  education: z.union([z.string().max(10_000), z.literal('')]).optional(),
  certifications: z.union([z.string().max(10_000), z.literal('')]).optional(),
  skills: z.union([z.string().max(5_000), z.literal('')]).optional(),
  achievements: z.union([z.string().max(10_000), z.literal('')]).optional(),
  languages: z.union([z.string().max(2_000), z.literal('')]).optional(),
  publications: z.union([z.string().max(10_000), z.literal('')]).optional(),
  volunteerWork: z.union([z.string().max(10_000), z.literal('')]).optional(),
  interests: z.union([z.string().max(2_000), z.literal('')]).optional(),
  references: z.union([z.string().max(5_000), z.literal('')]).optional(),
})

export const resumeUpdateSchema = resumeCreateSchema.partial().extend({
  id: z.string().min(10)
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ForgotInput = z.infer<typeof forgotSchema>
export type ResetInput = z.infer<typeof resetSchema>
export type ResumeCreateInput = z.infer<typeof resumeCreateSchema>
export type ResumeUpdateInput = z.infer<typeof resumeUpdateSchema>

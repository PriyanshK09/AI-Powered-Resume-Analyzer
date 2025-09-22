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
  targetRole: z.string().min(2).max(80).optional(),
  templateId: z.string().min(1).max(64).optional(),
  // New structured section fields (optional during transition)
  summary: z.string().min(10).max(2_000).optional(),
  experience: z.string().min(10).max(50_000).optional(),
  skills: z.string().min(2).max(5_000).optional(),
  fullName: z.string().min(2).max(120).optional(),
  email: z.string().email().max(255).optional(),
  phone: z.string().min(5).max(40).optional(),
  location: z.string().min(2).max(120).optional(),
  linkedin: z.string().url().max(255).optional(),
  github: z.string().url().max(255).optional(),
  portfolio: z.string().url().max(255).optional(),
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

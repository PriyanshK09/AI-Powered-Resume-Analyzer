// Global ambient types for the application

export interface SessionUser {
  id: string
  email: string
  name?: string | null
  tokenVersion: number
}

declare global {
  // Augmenting NodeJS namespace if needed later
  // namespace NodeJS { interface ProcessEnv { AUTH_SECRET: string } }
}

export {}

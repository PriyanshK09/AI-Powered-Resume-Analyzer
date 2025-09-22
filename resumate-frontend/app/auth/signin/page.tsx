// @ts-ignore
import { redirect } from 'next/navigation'
import { readSession } from '@/lib/auth'
import { SignInForm } from './SignInForm'

export const dynamic = 'force-dynamic'

export default async function SignInPage() {
  const session = await readSession()
  if (session) redirect('/dashboard')
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-400/20 to-purple-400/20 dark:from-violet-500/30 dark:to-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 dark:from-purple-500/30 dark:to-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <SignInForm />
    </div>
  )
}

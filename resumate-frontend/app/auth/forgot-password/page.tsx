"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// @ts-ignore
import { Bot, ArrowRight, Mail, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setError(null)
    try {
      setLoading(true)
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      try {
        const data = await res.json()
        if (data?.token) {
          console.info('Reset token (dev only):', data.token)
        }
      } catch {}
      setIsSubmitted(true)
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-400/20 to-purple-400/20 dark:from-violet-500/30 dark:to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 dark:from-purple-500/30 dark:to-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <Card className="p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/50 dark:border-slate-600/50 shadow-2xl text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-slate-100 mb-2">
              Check your email
            </h1>
            <p className="text-gray-600 dark:text-slate-400 mb-6">
              We sent a password reset link to <strong>{email}</strong>
            </p>
            <div className="space-y-4">
              <div className="text-sm text-green-600 dark:text-green-400 space-y-2">
                <p>If that email exists, reset instructions have been sent.</p>
                <p>
                  <span className="block">Have a reset token?</span>
                  <Link href="/auth/reset-password" className="underline text-violet-600 dark:text-violet-400">Reset your password</Link>
                </p>
              </div>
              <Button
                onClick={() => { setIsSubmitted(false); setEmail(""); setError(null) }}
                {...({ variant: "outline" } as any)}
                className="w-full h-12 bg-white/60 dark:bg-slate-700/60 border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600/80 transition-all duration-300 rounded-xl"
              >
                Try another email
              </Button>
              <Link href="/auth/signin">
                <Button className="w-full group bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white h-12 rounded-xl font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 dark:shadow-violet-500/30 dark:hover:shadow-violet-500/50 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                  <span className="relative z-10 flex items-center justify-center">
                    Back to sign in
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-400/20 to-purple-400/20 dark:from-violet-500/30 dark:to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 dark:from-purple-500/30 dark:to-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-violet-600 rounded-2xl blur-lg opacity-60"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Bot className="w-7 h-7 text-white" />
              </div>
            </div>
            <span className="text-3xl font-bold font-display bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
              ResuMate
            </span>
          </div>

          <Badge className="mb-4 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 dark:from-slate-800 dark:to-slate-700 dark:text-violet-300 border-0 px-4 py-2 text-sm font-medium">
            Password Reset
          </Badge>

          <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-slate-100 mb-2">
            Forgot your password?
          </h1>
          <p className="text-gray-600 dark:text-slate-400 font-light">
            Enter your email address and we'll send you a reset link
          </p>
        </div>

        {/* Forgot Password Card */}
        <Card className="p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/50 dark:border-slate-600/50 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-slate-300">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-white/60 dark:bg-slate-700/60 border-gray-200 dark:border-slate-600 rounded-xl focus:border-violet-500 dark:focus:border-violet-400 transition-all duration-300"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Reset Button */}
            {error && <p className="text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}
            {isSubmitted && !error && (
              <div className="text-sm text-green-600 dark:text-green-400 space-y-2">
                <p>If that email exists, reset instructions have been sent.</p>
                <p>
                  <span className="block">Have a reset token?</span>
                  <Link href="/auth/reset-password" className="underline text-violet-600 dark:text-violet-400">Reset your password</Link>
                </p>
              </div>
            )}
            {!isSubmitted && (
              <Button
                type="submit"
                disabled={loading || !email}
                className="w-full group bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white h-12 rounded-xl font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 dark:shadow-violet-500/30 dark:hover:shadow-violet-500/50 transition-all duration-300 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? 'Sending…' : 'Send reset link'}
                  {!loading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />}
                </span>
              </Button>
            )}
          </form>
        </Card>

        {/* Back to Sign In */}
        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-slate-400">
            Remember your password?{" "}
            <Link 
              href="/auth/signin" 
              className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors duration-300"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link 
            href="/" 
            className="text-sm text-gray-500 dark:text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-300 flex items-center justify-center"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
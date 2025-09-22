"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
// @ts-ignore
import { Mail, KeyRound, Lock, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ email: "", token: "", newPassword: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.message || "Reset failed")
      } else {
        setSuccess(true)
      }
    } catch {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
      <div className="w-full max-w-md">
        <Card className="p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/50 dark:border-slate-600/50 shadow-2xl">
          <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-slate-100 mb-2 text-center">Reset Password</h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-slate-300">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="pl-10 h-12 bg-white/60 dark:bg-slate-700/60 border-gray-200 dark:border-slate-600 rounded-xl focus:border-violet-500 dark:focus:border-violet-400 transition-all duration-300"
                  placeholder="Enter your email address"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="token" className="text-sm font-medium text-gray-700 dark:text-slate-300">Reset Token</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
                <Input
                  id="token"
                  name="token"
                  type="text"
                  required
                  value={form.token}
                  onChange={e => setForm(f => ({ ...f, token: e.target.value }))}
                  className="pl-10 h-12 bg-white/60 dark:bg-slate-700/60 border-gray-200 dark:border-slate-600 rounded-xl focus:border-violet-500 dark:focus:border-violet-400 transition-all duration-300"
                  placeholder="Paste your reset token"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium text-gray-700 dark:text-slate-300">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={form.newPassword}
                  onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
                  className="pl-10 h-12 bg-white/60 dark:bg-slate-700/60 border-gray-200 dark:border-slate-600 rounded-xl focus:border-violet-500 dark:focus:border-violet-400 transition-all duration-300"
                  placeholder="Enter new password"
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}
            {success && <p className="text-sm text-green-600 dark:text-green-400">Password reset! <Link href="/auth/signin" className="underline">Sign in</Link></p>}
            <Button type="submit" className="w-full group bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white h-12 rounded-xl font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 dark:shadow-violet-500/30 dark:hover:shadow-violet-500/50 transition-all duration-300 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              <span className="relative z-10 flex items-center justify-center">
                {loading ? 'Resetting…' : 'Reset Password'}
                {!loading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />}
              </span>
            </Button>
          </form>
          <div className="text-center mt-6">
            <Link href="/auth/forgot-password" className="text-sm text-violet-600 dark:text-violet-400 hover:underline">Back to Forgot Password</Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

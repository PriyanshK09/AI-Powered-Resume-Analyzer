"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Bot, ArrowRight, Mail, Lock, Github, Chrome } from "lucide-react"

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign in logic here
    console.log("Sign in attempt:", formData)
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
            Welcome Back
          </Badge>

          <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-slate-100 mb-2">
            Sign in to your account
          </h1>
          <p className="text-gray-600 dark:text-slate-400 font-light">
            Continue optimizing your career with AI-powered resumes
          </p>
        </div>

        {/* Sign In Card */}
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
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 h-12 bg-white/60 dark:bg-slate-700/60 border-gray-200 dark:border-slate-600 rounded-xl focus:border-violet-500 dark:focus:border-violet-400 transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 h-12 bg-white/60 dark:bg-slate-700/60 border-gray-200 dark:border-slate-600 rounded-xl focus:border-violet-500 dark:focus:border-violet-400 transition-all duration-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-violet-600 bg-gray-100 border-gray-300 rounded focus:ring-violet-500 dark:focus:ring-violet-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-slate-300">Remember me</span>
              </label>
              <Link 
                href="/auth/forgot-password" 
                className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors duration-300"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full group bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white h-12 rounded-xl font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 dark:shadow-violet-500/30 dark:hover:shadow-violet-500/50 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              <span className="relative z-10 flex items-center justify-center">
                Sign in to ResuMate
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Sign In */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-12 bg-white/60 dark:bg-slate-700/60 border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600/80 transition-all duration-300 rounded-xl group"
              >
                <Github className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                GitHub
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 bg-white/60 dark:bg-slate-700/60 border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600/80 transition-all duration-300 rounded-xl group"
              >
                <Chrome className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Google
              </Button>
            </div>
          </form>
        </Card>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-slate-400">
            Don't have an account?{" "}
            <Link 
              href="/auth/register" 
              className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors duration-300"
            >
              Sign up for free
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
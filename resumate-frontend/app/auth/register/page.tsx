"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Bot, ArrowRight, Mail, Lock, User, Github, Chrome, Check } from "lucide-react"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    marketingEmails: false,
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
    // Handle registration logic here
    console.log("Registration attempt:", formData)
  }

  const passwordRequirements = [
    { text: "At least 8 characters", met: formData.password.length >= 8 },
    { text: "Contains uppercase letter", met: /[A-Z]/.test(formData.password) },
    { text: "Contains lowercase letter", met: /[a-z]/.test(formData.password) },
    { text: "Contains number", met: /\d/.test(formData.password) },
  ]

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
            Join ResuMate
          </Badge>

          <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-slate-100 mb-2">
            Create your account
          </h1>
          <p className="text-gray-600 dark:text-slate-400 font-light">
            Start your journey to landing your dream job
          </p>
        </div>

        {/* Register Card */}
        <Card className="p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/50 dark:border-slate-600/50 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  First name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="pl-10 h-12 bg-white/60 dark:bg-slate-700/60 border-gray-200 dark:border-slate-600 rounded-xl focus:border-violet-500 dark:focus:border-violet-400 transition-all duration-300"
                    placeholder="John"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  Last name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="h-12 bg-white/60 dark:bg-slate-700/60 border-gray-200 dark:border-slate-600 rounded-xl focus:border-violet-500 dark:focus:border-violet-400 transition-all duration-300"
                  placeholder="Doe"
                />
              </div>
            </div>

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
                  placeholder="john.doe@example.com"
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
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-2 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-xs font-medium text-gray-600 dark:text-slate-400 mb-2">Password requirements:</p>
                  <div className="grid grid-cols-2 gap-1">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-1">
                        <Check className={`w-3 h-3 ${req.met ? 'text-green-500' : 'text-gray-300 dark:text-slate-600'}`} />
                        <span className={`text-xs ${req.met ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-slate-500'}`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-slate-300">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 h-12 bg-white/60 dark:bg-slate-700/60 border-gray-200 dark:border-slate-600 rounded-xl focus:border-violet-500 dark:focus:border-violet-400 transition-all duration-300"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-500 dark:text-red-400">Passwords do not match</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  required
                  className="w-4 h-4 text-violet-600 bg-gray-100 border-gray-300 rounded focus:ring-violet-500 dark:focus:ring-violet-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mt-0.5"
                />
                <span className="text-sm text-gray-700 dark:text-slate-300">
                  I agree to the{" "}
                  <Link href="/terms" className="text-violet-600 dark:text-violet-400 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-violet-600 dark:text-violet-400 hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="marketingEmails"
                  checked={formData.marketingEmails}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-violet-600 bg-gray-100 border-gray-300 rounded focus:ring-violet-500 dark:focus:ring-violet-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mt-0.5"
                />
                <span className="text-sm text-gray-700 dark:text-slate-300">
                  I'd like to receive marketing emails about ResuMate features and tips
                </span>
              </label>
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              disabled={!formData.agreeToTerms || formData.password !== formData.confirmPassword}
              className="w-full group bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white h-12 rounded-xl font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 dark:shadow-violet-500/30 dark:hover:shadow-violet-500/50 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              <span className="relative z-10 flex items-center justify-center">
                Create your account
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
                  Or sign up with
                </span>
              </div>
            </div>

            {/* Social Sign Up */}
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

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-slate-400">
            Already have an account?{" "}
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
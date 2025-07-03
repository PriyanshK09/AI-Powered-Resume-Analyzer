"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Zap, Check } from "lucide-react"

interface HeroSectionProps {
  scrollY: number
}

export default function HeroSection({ scrollY }: HeroSectionProps) {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-violet-950 dark:to-purple-950"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="container mx-auto text-center max-w-7xl relative z-10">
        <div
          className="mb-12 transform transition-all duration-1000"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          <Badge className="mb-6 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 dark:from-violet-900/50 dark:to-purple-900/50 dark:text-violet-300 border-0 px-6 py-2 text-sm font-medium shadow-lg backdrop-blur-sm">
            <Zap className="w-4 h-4 mr-2 animate-pulse" />
            AI-Powered Resume Intelligence
          </Badge>

          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 bg-clip-text text-transparent animate-gradient">
              Land Your Dream Job
            </span>
            <br />
            <span className="text-gray-800 dark:text-gray-200">with AI-Optimized</span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              Resumes
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Generate, analyze, and score your resume with advanced AI. Get personalized suggestions and ATS-friendly
            templates that get you noticed by top employers.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Button
            size="lg"
            className="group bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-lg px-10 py-6 rounded-2xl shadow-2xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 transition-all duration-300 border-0"
          >
            <span className="mr-3">Generate My Resume</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-10 py-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-violet-200 dark:border-violet-800 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:scale-105 transition-all duration-300 shadow-xl"
          >
            Try Demo
          </Button>
        </div>

        {/* Enhanced Hero Visual */}
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-3xl blur-3xl"></div>
          <Card className="relative p-10 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-0 shadow-2xl rounded-3xl hover:shadow-3xl transition-all duration-500">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    AI Analysis in Progress
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse"></div>
                  <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl w-3/4 animate-pulse delay-100"></div>
                  <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl w-1/2 animate-pulse delay-200"></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Resume Score</span>
                  <span className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    87/100
                  </span>
                </div>
                <div className="relative">
                  <Progress value={87} className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden" />
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full shadow-lg shadow-violet-500/30"
                    style={{ width: "87%" }}
                  ></div>
                </div>
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="font-medium">ATS Friendly</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Grammar Perfect</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
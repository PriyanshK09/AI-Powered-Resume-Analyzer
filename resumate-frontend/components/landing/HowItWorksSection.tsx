"use client"

import { Badge } from "@/components/ui/badge"
import { Upload, Search, Palette, Award, ArrowRight } from "lucide-react"

export default function HowItWorksSection() {
  const steps = [
    {
      icon: Upload,
      title: "Upload",
      description: "Upload your existing resume or start from scratch with our guided builder",
      gradient: "from-violet-500 to-purple-500",
      shadowColor: "shadow-violet-500/25",
      borderColor: "border-violet-200 dark:border-violet-700",
      bgHover: "hover:bg-violet-50 dark:hover:bg-violet-900/20",
    },
    {
      icon: Search,
      title: "Analyze",
      description: "Our AI analyzes content, structure, keywords, and ATS compatibility",
      gradient: "from-purple-500 to-pink-500",
      shadowColor: "shadow-purple-500/25",
      borderColor: "border-purple-200 dark:border-purple-700",
      bgHover: "hover:bg-purple-50 dark:hover:bg-purple-900/20",
    },
    {
      icon: Palette,
      title: "Customize",
      description: "Apply AI suggestions and choose from professional templates",
      gradient: "from-pink-500 to-rose-500",
      shadowColor: "shadow-pink-500/25",
      borderColor: "border-pink-200 dark:border-pink-700",
      bgHover: "hover:bg-pink-50 dark:hover:bg-pink-900/20",
    },
    {
      icon: Award,
      title: "Score",
      description: "Get your optimized resume with detailed scoring and feedback",
      gradient: "from-rose-500 to-violet-500",
      shadowColor: "shadow-rose-500/25",
      borderColor: "border-rose-200 dark:border-rose-700",
      bgHover: "hover:bg-rose-50 dark:hover:bg-rose-900/20",
    },
  ]

  return (
    <section id="features" className="relative py-20 px-6 overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/30 to-white dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-violet-400/10 to-purple-400/10 dark:from-violet-500/20 dark:to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 dark:from-purple-500/20 dark:to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <Badge className="mb-6 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 dark:from-slate-800 dark:to-slate-700 dark:text-violet-300 border-0 px-6 py-2 text-sm font-medium shadow-lg backdrop-blur-sm">
            Simple Process
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-display text-gray-900 dark:text-slate-100">
            How ResuMate Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
            Four simple steps to transform your resume with AI-powered intelligence
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Static Connection Line - Desktop Only */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-200/50 dark:via-violet-700/50 to-transparent transform -translate-y-1/2 z-0"></div>
          
          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="group relative">
                {/* Step Number */}
                <div className="absolute -top-4 left-6 z-50">
                  <div className="w-8 h-8 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-gray-700 dark:text-slate-300">
                      {index + 1}
                    </span>
                  </div>
                </div>

                {/* Card */}
                <div className={`relative bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg hover:shadow-xl border-2 ${step.borderColor} transition-all duration-500 hover:scale-105 ${step.bgHover} overflow-hidden z-40`}>
                  {/* Background Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Floating Decoration */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-sm"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-sm"></div>

                  {/* Icon Container */}
                  <div className={`relative w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg ${step.shadowColor} transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 z-10`}>
                    <div className="absolute inset-0 bg-white/20 rounded-2xl transform rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
                    <step.icon className="relative w-10 h-10 text-white drop-shadow-sm" />
                  </div>

                  {/* Content */}
                  <div className="text-center relative z-10">
                    <h3 className="text-2xl font-bold mb-4 font-display text-gray-900 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-slate-400 leading-relaxed font-light">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Mobile Arrow - Mobile Only - Show arrows on mobile/tablet */}
                {index < 3 && (
                  <div className="lg:hidden flex justify-center mt-6 z-10">
                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border-2 border-violet-200 dark:border-violet-600 shadow-lg">
                      <ArrowRight className="w-5 h-5 text-violet-500 dark:text-violet-400 rotate-90" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 relative z-10">
          <div className="inline-flex items-center space-x-4 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-600">
            <div className="text-gray-700 dark:text-slate-300 font-medium">
              Ready to get started?
            </div>
            <button className="group bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 dark:shadow-violet-500/30 dark:hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              <span className="relative z-10 flex items-center">
                Try ResuMate Free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
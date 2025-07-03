"use client"

import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"

interface Testimonial {
  name: string
  role: string
  company: string
  content: string
  rating: number
  improvement: string
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="relative py-16 px-6 overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-r from-violet-400/20 to-purple-400/20 dark:from-violet-500/30 dark:to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 dark:from-purple-500/30 dark:to-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 dark:from-slate-800 dark:to-slate-700 dark:text-violet-300 border-0 px-6 py-2 text-sm font-medium shadow-lg backdrop-blur-sm">
            Success Stories
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-display text-gray-900 dark:text-slate-100">What Our Users Say</h2>
          <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
            See how ResuMate helped professionals land their dream jobs
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative h-full"
            >
              {/* Card with Enhanced Dark Mode */}
              <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-slate-600 overflow-hidden h-full flex flex-col min-h-[300px]">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10 dark:opacity-20">
                  <Quote className="w-10 h-10 text-violet-600 dark:text-violet-400" />
                </div>

                {/* Stars Rating */}
                <div className="flex items-center mb-4 relative z-10">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-5 h-5 text-amber-400 fill-current mr-1 drop-shadow-sm" 
                    />
                  ))}
                </div>

                {/* Quote Content */}
                <blockquote className="relative z-10 mb-6 flex-grow">
                  <p className="text-gray-700 dark:text-slate-300 text-base leading-relaxed italic font-light">
                    "{testimonial.content}"
                  </p>
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center justify-between relative z-10 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-base font-display text-gray-900 dark:text-slate-100">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-slate-400 font-medium">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Improvement Badge */}
                <div className="relative z-10">
                  <div className="inline-flex items-center bg-gradient-to-r from-violet-100 to-purple-100 dark:from-slate-700 dark:to-slate-600 text-violet-700 dark:text-violet-300 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm border border-violet-200/50 dark:border-slate-500/50">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    {testimonial.improvement}
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-violet-400 to-purple-500 dark:from-violet-500 dark:to-purple-600 rounded-full opacity-20 dark:opacity-30 blur-sm"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-500 dark:from-purple-500 dark:to-pink-600 rounded-full opacity-20 dark:opacity-30 blur-sm"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-12">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-purple-600/20 dark:from-violet-500/30 dark:to-purple-500/30 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-slate-600/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Ready to Join Our Success Stories?
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-4 font-light text-sm">
                Start building your AI-optimized resume today and land your dream job faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="group bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 dark:shadow-violet-500/30 dark:hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105 relative overflow-hidden text-sm">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                  <span className="relative z-10">Start Free Trial</span>
                </button>
                <button className="group bg-white/70 dark:bg-slate-700/70 backdrop-blur-xl border border-violet-200 dark:border-slate-500 text-violet-600 dark:text-violet-400 px-6 py-2.5 rounded-xl font-medium hover:bg-violet-50 dark:hover:bg-slate-600/80 transition-all duration-300 hover:scale-105 text-sm">
                  View Templates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
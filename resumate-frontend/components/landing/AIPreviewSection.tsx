"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Bot, Check } from "lucide-react"

export default function AIPreviewSection() {
  const features = [
    "Real-time content optimization",
    "Industry-specific keyword suggestions",
    "ATS compatibility checking",
    "Grammar and style improvements",
  ]

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4 bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
              <Bot className="w-3 h-3 mr-1" />
              AI-Powered Suggestions
            </Badge>
            <h2 className="text-4xl font-bold mb-6">Smart Resume Builder with Real-time AI Feedback</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Watch as our AI provides intelligent suggestions while you build your resume. Get instant feedback on
              content, formatting, and keyword optimization.
            </p>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="p-6 bg-white dark:bg-gray-800 shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">John Doe</h3>
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm text-indigo-600 dark:text-indigo-400">AI Suggestion</span>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Software Engineer</div>
              <div className="border-l-4 border-amber-400 pl-4 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-r">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  💡 Consider adding "React" and "TypeScript" to match 89% of similar job postings
                </p>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/5"></div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
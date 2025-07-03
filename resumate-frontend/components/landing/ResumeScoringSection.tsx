"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Check, Zap } from "lucide-react"

export default function ResumeScoringSection() {
  const metrics = [
    { label: "Overall Score", value: 87, color: "indigo" },
    { label: "ATS Compatibility", value: 92, color: "green" },
    { label: "Content Quality", value: 85, color: "violet" },
    { label: "Design & Format", value: 90, color: "amber" },
  ]

  const positiveRecommendations = [
    {
      title: "Strong Action Verbs",
      description: "Great use of impactful action verbs throughout",
    },
    {
      title: "Quantified Achievements",
      description: "Excellent use of numbers and metrics",
    },
  ]

  const improvements = [
    {
      title: "Add Technical Skills",
      description: "Include Python, AWS, Docker for better ATS matching",
    },
    {
      title: "Optimize Length",
      description: "Consider condensing to 1-2 pages for better impact",
    },
  ]

  return (
    <section className="py-16 px-4 bg-white dark:bg-gray-800">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Comprehensive Resume Scoring</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get detailed insights into your resume's performance across multiple criteria
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="text-3xl font-bold mb-2 text-indigo-600">{metric.value}/100</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">{metric.label}</div>
              <Progress value={metric.value} className="h-2" />
            </Card>
          ))}
        </div>

        <Card className="p-8">
          <h3 className="text-2xl font-semibold mb-6">AI Recommendations</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {positiveRecommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-green-800 dark:text-green-200">{rec.title}</div>
                    <div className="text-sm text-green-600 dark:text-green-300">{rec.description}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {improvements.map((improvement, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <Zap className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-amber-800 dark:text-amber-200">{improvement.title}</div>
                    <div className="text-sm text-amber-600 dark:text-amber-300">{improvement.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
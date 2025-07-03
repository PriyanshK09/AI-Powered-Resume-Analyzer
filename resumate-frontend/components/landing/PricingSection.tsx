"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: ["1 Resume", "Basic Templates", "AI Scoring", "PDF Export"],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      features: [
        "Unlimited Resumes",
        "Premium Templates",
        "Advanced AI Analysis",
        "Cover Letter Generator",
        "ATS Optimization",
        "Priority Support",
      ],
      cta: "Start Pro Trial",
      popular: true,
    },
    {
      name: "Resume+",
      price: "$39",
      period: "per month",
      features: [
        "Everything in Pro",
        "LinkedIn Optimization",
        "Interview Prep AI",
        "Salary Insights",
        "Career Coaching",
        "White-label Access",
      ],
      cta: "Go Premium",
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="relative py-16 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/30 to-white dark:from-gray-900 dark:via-violet-950/30 dark:to-gray-900"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 dark:from-violet-900/50 dark:to-purple-900/50 dark:text-violet-300 border-0 px-6 py-2 text-sm font-medium shadow-lg backdrop-blur-sm">
            Pricing Plans
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-display">Choose Your Plan</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            Start free and upgrade as you grow. All plans include AI-powered features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className="relative">
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Card */}
              <div
                className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border h-full ${
                  plan.popular
                    ? "border-violet-200 dark:border-violet-700 ring-2 ring-violet-100 dark:ring-violet-800"
                    : "border-gray-100 dark:border-gray-700"
                }`}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4 font-display text-gray-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    {plan.price}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">{plan.period}</div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className={`w-full py-3 text-lg font-semibold rounded-xl transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
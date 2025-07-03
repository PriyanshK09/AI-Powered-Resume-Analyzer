"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TemplatesSection() {
  const templates = [
    {
      name: "Modern Professional",
      preview: "bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950 dark:to-violet-950",
    },
    {
      name: "Creative Designer",
      preview: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950",
    },
    {
      name: "Tech Executive",
      preview: "bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950 dark:to-gray-950",
    },
    {
      name: "Marketing Specialist",
      preview: "bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950 dark:to-rose-950",
    },
  ]

  return (
    <section id="templates" className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">ATS-Friendly Templates</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose from our collection of professionally designed, ATS-optimized resume templates
          </p>
        </div>

        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template, index) => (
              <Card
                key={index}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className={`h-64 ${template.preview} relative`}>
                  <div className="absolute inset-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                      <div className="mt-4 space-y-1">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-3/5"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      ATS Friendly
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Perfect for modern professionals</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
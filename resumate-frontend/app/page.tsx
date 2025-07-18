"use client"

import { useState, useEffect } from "react"
import Header from "@/components/landing/Header"
import HeroSection from "@/components/landing/HeroSection"
import HowItWorksSection from "@/components/landing/HowItWorksSection"
import AIPreviewSection from "@/components/landing/AIPreviewSection"
import ResumeScoringSection from "@/components/landing/ResumeScoringSection"
import TemplatesSection from "@/components/landing/TemplatesSection"
import TestimonialsSection from "@/components/landing/TestimonialsSection"
import PricingSection from "@/components/landing/PricingSection"
import Footer from "@/components/landing/Footer"

export default function ResuMateLanding() {
  const [darkMode, setDarkMode] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Google",
      content:
        "ResuMate helped me land my dream job at Google. The AI scoring feature identified gaps I never noticed.",
      rating: 5,
      improvement: "+40% interview calls",
    },
    {
      name: "Marcus Johnson",
      role: "Product Manager",
      company: "Microsoft",
      content:
        "The ATS optimization suggestions were game-changing. My resume now passes through all screening systems.",
      rating: 5,
      improvement: "+60% ATS score",
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      company: "Figma",
      content: "Beautiful templates and smart suggestions. ResuMate made my resume stand out in a competitive market.",
      rating: 5,
      improvement: "+3x more responses",
    },
  ]

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark" : ""}`}>
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} scrollY={scrollY} />
        <HeroSection scrollY={scrollY} />
        <HowItWorksSection />
        <AIPreviewSection />
        <ResumeScoringSection />
        <TemplatesSection />
        <TestimonialsSection testimonials={testimonials} />
        <PricingSection />
        <Footer />
      </div>
    </div>
  )
}

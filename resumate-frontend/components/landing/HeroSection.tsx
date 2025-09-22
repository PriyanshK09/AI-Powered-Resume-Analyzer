"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
// @ts-ignore
import {
  ArrowRight,
  Zap,
  Check,
  Brain,
  FileText,
  Sparkles,
  Target,
  BarChart3,
  Settings2,
  Briefcase,
  LayoutTemplate,
  ShieldCheck,
  ClipboardList,
  Award,
  Rocket,
  TrendingUp,
  UserCheck
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
// Additional lucide icons
// @ts-ignore
import { BookOpen, Wand2, Layers, ListChecks, Lightbulb } from "lucide-react"

interface HeroSectionProps {
  // Keeping prop for backward compatibility; no longer used for janky translateY motion.
  scrollY?: number
}

export default function HeroSection(_props: HeroSectionProps) {
  // Parallax for floating icons (very light, disabled for reduced motion)
  const floatLayerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const layer = floatLayerRef.current
    if (!layer) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const handle = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth - 0.5) * 12 // max 6px translate each side for subtlety
      const y = (e.clientY / innerHeight - 0.5) * 12
      layer.style.setProperty('--parallax-x', `${x.toFixed(2)}px`)
      layer.style.setProperty('--parallax-y', `${y.toFixed(2)}px`)
    }
    window.addEventListener('pointermove', handle)
    return () => window.removeEventListener('pointermove', handle)
  }, [])

  // Configuration for floating decorative icons (no overlapping coordinates)
  const floatingIcons: Array<{
    id: string
    Icon: React.ComponentType<{ className?: string }>
    top?: string
    left?: string
    right?: string
    delay: number
    pulse?: boolean
    responsiveClass?: string
  }> = [
    // Core icons (always visible) placed away from central text column (approx 25%-75% horizontal center avoided)
    { id: 'ai', Icon: Brain, top: '8%', left: '6%', delay: 0, pulse: true },
    { id: 'templates', Icon: LayoutTemplate, top: '14%', right: '8%', delay: 1.2 },
    { id: 'resume', Icon: FileText, top: '50%', left: '4%', delay: 2.4 },
    { id: 'analytics', Icon: BarChart3, top: '62%', right: '6%', delay: 3.6, pulse: true },
    { id: 'target', Icon: Target, top: '34%', right: '4%', delay: 1.8 },
    { id: 'optimize', Icon: Settings2, top: '78%', left: '12%', delay: 2.9 },
    // Secondary icons (hidden on very small screens)
    { id: 'jobs', Icon: Briefcase, top: '26%', right: '20%', delay: 4.2, responsiveClass: 'hidden sm:block', pulse: true },
    { id: 'security', Icon: ShieldCheck, top: '70%', left: '18%', delay: 5.1, responsiveClass: 'hidden sm:block' },
    { id: 'recommend', Icon: ClipboardList, top: '22%', left: '22%', delay: 0.6, responsiveClass: 'hidden sm:block' },
    { id: 'achievement', Icon: Award, top: '44%', right: '18%', delay: 3.0, responsiveClass: 'hidden md:block' },
    { id: 'growth', Icon: TrendingUp, top: '56%', right: '24%', delay: 4.8, responsiveClass: 'hidden md:block', pulse: true },
    { id: 'candidate', Icon: UserCheck, top: '84%', right: '26%', delay: 2.1, responsiveClass: 'hidden sm:block' },
    { id: 'spark', Icon: Sparkles, top: '18%', left: '10%', delay: 5.4, responsiveClass: 'hidden md:block' },
    { id: 'launch', Icon: Rocket, top: '86%', left: '48%', delay: 6.0, responsiveClass: 'hidden md:block' },
    // Added new icons
    { id: 'knowledge', Icon: BookOpen, top: '32%', left: '4%', delay: 3.3, responsiveClass: 'hidden lg:block' },
    { id: 'magic', Icon: Wand2, top: '68%', right: '14%', delay: 2.7, responsiveClass: 'hidden lg:block', pulse: true },
    { id: 'structure', Icon: Layers, top: '40%', left: '16%', delay: 1.5, responsiveClass: 'hidden lg:block' },
    { id: 'checks', Icon: ListChecks, top: '60%', left: '26%', delay: 4.5, responsiveClass: 'hidden xl:block' },
    { id: 'ideas', Icon: Lightbulb, top: '28%', right: '12%', delay: 5.7, responsiveClass: 'hidden lg:block', pulse: true }
  ]

  return (
  <section className="relative isolate overflow-hidden">
      {/* Background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-50 via-white to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-900" />
        {/* Soft radial spotlight */}
        <div className="absolute left-1/2 top-[-240px] h-[680px] w-[880px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.22),transparent_70%)] blur-2xl" />
        {/* Secondary accent */}
        <div className="absolute right-[8%] top-[42%] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(196,181,253,0.18),transparent_70%)] blur-2xl" />
        {/* Faint grid overlay */}
        <div className="absolute inset-0 opacity-[0.35] mix-blend-overlay dark:opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,119,198,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,119,198,0.15)_1px,transparent_1px)] bg-[size:44px_44px]" />
        </div>
        {/* Concentric ring */}
        <div className="absolute left-1/2 top-32 -translate-x-1/2 h-[520px] w-[520px] rounded-full border border-violet-400/20 [mask-image:radial-gradient(circle_at_center,transparent_35%,black)]" />
        {/* Floating decorative icons layer */}
        <div ref={floatLayerRef} className="absolute inset-0 overflow-visible">
          {floatingIcons.map((cfg, i) => (
            <IconFloat
              key={cfg.id}
              delay={cfg.delay}
              style={{ top: cfg.top, left: cfg.left, right: cfg.right }}
              colorIndex={i}
              pulse={cfg.pulse}
              className={cfg.responsiveClass}
            >
              <cfg.Icon className="size-full" />
            </IconFloat>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 pt-28 pb-16 md:pt-36 md:pb-32 max-w-7xl">
        <div className="mx-auto flex flex-col items-center text-center max-w-3xl">
          <Badge
            className="mb-6 flex items-center gap-2 border border-violet-200/70 dark:border-violet-800/60 bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm text-violet-700 dark:text-violet-300 font-medium shadow-sm"
          >
            <Zap className="w-4 h-4 text-violet-500 dark:text-violet-400 motion-safe:animate-pulse" />
            AI Resume Platform
          </Badge>
          <h1 className="font-bold tracking-tight text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-gray-900 dark:text-white">
            Craft a Resume That <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Gets Interviews</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Instantly generate, refine, and score your resume with advanced AI. Actionable insights, ATS optimization,
            and polished templates—so you can focus on landing the role.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Primary CTA */}
            <Button
              {...({ size: "lg" } as any)}
              className="cta-shimmer relative group rounded-xl px-7 sm:px-8 py-5 text-base font-medium bg-gradient-to-b from-violet-500 via-violet-600 to-purple-600 shadow-[0_4px_18px_-4px_rgba(109,40,217,0.45)] hover:shadow-[0_6px_28px_-6px_rgba(109,40,217,0.55)] active:scale-[0.97] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
              aria-label="Get started for free"
            >
              <span className="flex items-center font-semibold tracking-tight">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
              {/* subtle gradient edge highlight */}
              <span className="pointer-events-none absolute inset-px rounded-[11px] bg-[linear-gradient(145deg,rgba(255,255,255,0.22),transparent_40%)] opacity-70 mix-blend-overlay" />
            </Button>
            {/* Secondary CTA */}
            <Button
              {...({ variant: "outline" } as any)}
              {...({ size: "lg" } as any)}
              className="relative rounded-xl px-7 sm:px-8 py-5 text-base font-medium border border-violet-200/70 dark:border-violet-800/70 bg-white/70 dark:bg-gray-900/40 hover:bg-white/90 dark:hover:bg-gray-900/60 transition-all duration-300 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
              aria-label="View live demo"
            >
              <span className="flex items-center font-semibold tracking-tight">Live Demo</span>
              <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.15),transparent_70%)]" />
            </Button>
          </div>

          {/* Feature badges */}
          <ul className="mt-8 grid w-full gap-3 sm:gap-4 sm:grid-cols-3 text-left text-sm">
            {[
              {
                label: 'ATS Optimization',
                desc: 'Parsing + keyword checks',
                icon: <ListChecks className="h-3.5 w-3.5" />, // semantic checklist
                accent: 'from-violet-500/15 via-purple-500/15 to-fuchsia-500/15'
              },
              {
                label: 'Real-Time Scoring',
                desc: 'Live feedback as you edit',
                icon: <BarChart3 className="h-3.5 w-3.5" />,
                accent: 'from-indigo-500/15 via-violet-500/15 to-purple-500/15'
              },
              {
                label: 'Tailored Suggestions',
                desc: 'Role & industry aware',
                icon: <Lightbulb className="h-3.5 w-3.5" />,
                accent: 'from-fuchsia-500/15 via-violet-500/15 to-indigo-500/15'
              }
            ].map((f) => (
              <li
                key={f.label}
                className="group relative flex items-start gap-3 rounded-xl border border-violet-200/60 dark:border-violet-800/50 bg-white/55 dark:bg-gray-900/40 px-4 py-3 backdrop-blur-sm transition duration-300 hover:border-violet-400/70 dark:hover:border-violet-600/70 hover:shadow-[0_4px_18px_-6px_rgba(109,40,217,0.35)]"
              >
                <span className={`pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r ${f.accent}`} />
                <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-white/70 to-white/40 dark:from-gray-950/60 dark:to-gray-900/40 border border-violet-200/60 dark:border-violet-700/50 shadow-sm group-hover:shadow-md group-hover:border-violet-300/70 dark:group-hover:border-violet-500/70 transition-colors">
                  <span className="text-violet-600 dark:text-violet-300">{f.icon}</span>
                  <span className="absolute -inset-px rounded-md bg-gradient-to-tr from-white/40 to-transparent opacity-60 mix-blend-overlay pointer-events-none" />
                </span>
                <div className="relative z-10 leading-tight">
                  <p className="font-medium text-gray-800 dark:text-gray-100 tracking-tight text-[13px]">{f.label}</p>
                  <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400 font-normal hidden md:block">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Trust logos (API-based continuous marquee) */}
          <div className="mt-12 w-full">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 text-center mb-5">Trusted by candidates hired at</p>
            <div className="relative overflow-hidden logo-marquee-mask">
              <TooltipProvider delayDuration={150} skipDelayDuration={100} disableHoverableContent>
              <ul className="logo-marquee-track gap-10 md:gap-14 items-center" aria-label="Hiring company logos scrolling" role="list">
                {(() => {
                  const token = 'pk_HiZYVD9OQQmzlAV5DmqY_A' // public token provided
                  const companies = [
                    { name: 'Zomato', domain: 'zomato.com' },
                    { name: 'Swiggy', domain: 'swiggy.com' },
                    { name: 'Paytm', domain: 'paytm.com' },
                    { name: 'CRED', domain: 'cred.club' },
                    { name: 'Razorpay', domain: 'razorpay.com' },
                    { name: 'Freshworks', domain: 'freshworks.com' },
                    { name: 'Flipkart', domain: 'flipkart.com' },
                    { name: 'Zoho', domain: 'zoho.com' },
                  ]
                  const sequence = [...companies, ...companies]
                  return sequence.map((c, idx) => {
                    const isDuplicate = idx >= companies.length
                    const url = `https://img.logo.dev/${c.domain}?token=${token}&format=png&retina=true`
                    return (
                      <li
                        key={`${c.name}-${idx}`}
                        className="logo-tile min-w-28 md:min-w-32 opacity-85 hover:opacity-100 focus-visible:opacity-100 transition-opacity outline-none"
                        tabIndex={0}
                        aria-hidden={isDuplicate}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <img
                              src={url}
                              alt={`${c.name} logo`}
                              loading={idx < companies.length ? 'eager' : 'lazy'}
                              decoding="async"
                              className="h-6 md:h-8 w-auto select-none"
                              draggable={false}
                            />
                          </TooltipTrigger>
                          {!isDuplicate && (
                            <TooltipContent side="top" className="px-2 py-1 text-xs font-medium">
                              {c.name}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </li>
                    )
                  })
                })()}
              </ul>
              </TooltipProvider>
            </div>
            {/* KPI Bar (Improved) */}
            <div className="mt-8 rounded-2xl border border-violet-200/60 dark:border-violet-800/60 bg-white/65 dark:bg-gray-900/45 backdrop-blur-md px-6 py-6 shadow-[0_4px_18px_-6px_rgba(109,40,217,0.25)]">
              <dl className="kpi-bar" aria-label="Key product performance indicators">
                {/* Resumes Optimized */}
                <div className="kpi-item">
                  <dt className="sr-only">Resumes Optimized</dt>
                  <dd className="flex flex-col items-center sm:items-start gap-1">
                    <KpiCounter end={12000} suffix="+" ariaLabel="twelve thousand plus resumes optimized" />
                    <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400 tracking-tight">Resumes Optimized</span>
                  </dd>
                </div>
                {/* Interview Rate */}
                <div className="kpi-item">
                  <dt className="sr-only">Average Interview Rate Increase</dt>
                  <dd className="flex flex-col items-center sm:items-start gap-1">
                    <KpiCounter end={38} prefix="+" suffix="%" ariaLabel="average thirty eight percent increase in interview rate" />
                    <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400 tracking-tight">Avg Interview Rate</span>
                  </dd>
                </div>
                {/* Satisfaction */}
                <div className="kpi-item">
                  <dt className="sr-only">User Satisfaction Score</dt>
                  <dd className="flex flex-col items-center sm:items-start gap-1">
                    <KpiCounter end={4.9} decimals={1} suffix="/5" ariaLabel="four point nine out of five user satisfaction" />
                    <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400 tracking-tight">User Satisfaction</span>
                  </dd>
                </div>
                {/* Optional add-on: time saved metric */}
                <div className="kpi-item hidden md:block">
                  <dt className="sr-only">Average Time Saved Per Resume</dt>
                  <dd className="flex flex-col items-center sm:items-start gap-1">
                    <KpiCounter end={42} suffix="min" ariaLabel="forty two minutes average time saved" />
                    <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400 tracking-tight">Avg Time Saved</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Preview Card */}
  <div className="mt-16 relative">
          <div className="absolute inset-x-0 -top-10 flex justify-center" aria-hidden="true">
            <div className="h-40 w-[60%] max-w-2xl bg-gradient-to-r from-violet-400/20 via-purple-400/20 to-violet-400/20 blur-3xl rounded-full" />
          </div>
          <div className="relative mx-auto max-w-5xl">
            {/* Gradient outline wrapper */}
            <div className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-violet-500/30 via-purple-500/30 to-violet-500/30 opacity-0 blur-sm transition duration-500 group-hover/card:opacity-100" />
            <Card className="relative group/card overflow-hidden rounded-2xl border border-violet-200/60 dark:border-violet-800/60 bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl shadow-xl">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.15),transparent_60%)]" />
            <div className="grid gap-12 p-10 md:grid-cols-2 md:gap-16">
              <div className="flex flex-col justify-center space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 dark:bg-violet-950/40 px-3 py-1 text-xs font-medium text-violet-700 dark:text-violet-300 w-fit">
                  <span className="h-2 w-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 animate-pulse" /> Live AI Insight
                </div>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  Our scoring engine benchmarks your resume against thousands of successful profiles. Improve clarity,
                  impact metrics, keyword alignment, and structure in minutes.
                </p>
                <div className="grid gap-4 sm:grid-cols-2 text-sm">
                  <div className="rounded-lg border border-violet-200/60 dark:border-violet-800/50 bg-white/60 dark:bg-gray-900/40 p-4">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Current Score</p>
                    <p className="text-3xl font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">87</p>
                    <Progress value={87} className="mt-3 h-2" />
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><Check className="h-4 w-4 text-green-500" /> ATS Friendly</li>
                    <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><Check className="h-4 w-4 text-green-500" /> Grammar Clean</li>
                    <li className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><Check className="h-4 w-4 text-green-500" /> Role Keywords</li>
                  </ul>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10" aria-hidden="true" />
                <div className="relative space-y-4 rounded-xl border border-violet-200/60 dark:border-violet-800/50 bg-white/70 dark:bg-gray-900/40 p-6 backdrop-blur-sm">
                  <div className="h-4 w-3/4 rounded-md bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
                  <div className="h-4 w-2/3 rounded-md bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
                  <div className="h-4 w-1/2 rounded-md bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
                  <div className="pt-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Suggestions</p>
                    <ul className="space-y-2 text-xs">
                      <li className="flex items-start gap-2"><Check className="h-3 w-3 mt-0.5 text-violet-600" /> Add measurable impact to bullet 2.</li>
                      <li className="flex items-start gap-2"><Check className="h-3 w-3 mt-0.5 text-violet-600" /> Align skills with JD: Kubernetes, Terraform.</li>
                      <li className="flex items-start gap-2"><Check className="h-3 w-3 mt-0.5 text-violet-600" /> Consider merging redundant sections.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

// Decorative floating icon wrapper
function IconFloat({ children, delay = 0, style, colorIndex = 0, pulse = false, className = '' }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties; colorIndex?: number; pulse?: boolean; className?: string }) {
  const palette = [
    'text-violet-500/35 dark:text-violet-300/25',
    'text-purple-500/30 dark:text-purple-300/25',
    'text-fuchsia-500/30 dark:text-fuchsia-300/25',
    'text-indigo-500/30 dark:text-indigo-300/25'
  ]
  const colorClass = palette[colorIndex % palette.length]
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute icon-float ${className}`} style={style}>
      <div
        className={`icon-float-inner size-7 md:size-9 lg:size-10 flex items-center justify-center ${colorClass} drop-shadow-[0_0_5px_rgba(124,58,237,0.15)]`}
        style={{ animationDelay: `${delay}s` }}
      >
        <div className={pulse ? 'icon-pulse-wrapper icon-pulse' : 'icon-pulse-wrapper'} style={{ ['--pulse-delay' as any]: `${(delay * 0.7).toFixed(2)}s` }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// KPI counter component with intersection based count-up
function KpiCounter({ end, duration = 1800, prefix = '', suffix = '', decimals = 0, ariaLabel }: { end: number; duration?: number; prefix?: string; suffix?: string; decimals?: number; ariaLabel?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null)
  // Start at 0 for visible count-up (SSR fallback shows 0 or truncated format if large not desired)
  const [display, setDisplay] = useState<string>(() => format(0, prefix, suffix, decimals))
  const startedRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) { setDisplay(format(end, prefix, suffix, decimals)); return }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true
          animate()
        }
      })
    }, { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()

    function animate() {
      const start = performance.now()
      const from = 0
      const to = end
      const dur = duration
      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / dur)
        const eased = easeOutQuart(progress)
        const current = from + (to - from) * eased
        setDisplay(format(current, prefix, suffix, decimals))
        if (progress < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }
  }, [end, duration, prefix, suffix, decimals])

  return (
    <span ref={ref} aria-label={ariaLabel} className="font-semibold kpi-value kpi-animate-in">{display}</span>
  )
}

function format(value: number, prefix: string, suffix: string, decimals: number, truncateLarge = false) {
  let v = value
  if (truncateLarge && v >= 1000 && decimals === 0) {
    if (v >= 1000000) return prefix + (v / 1000000).toFixed(1).replace(/\.0$/, '') + 'M' + suffix
    return prefix + (v / 1000).toFixed(0) + 'k' + suffix
  }
  const factor = Math.pow(10, decimals)
  v = Math.round(v * factor) / factor
  return prefix + v.toLocaleString() + suffix
}

function easeOutQuart(x: number) { return 1 - Math.pow(1 - x, 4) }
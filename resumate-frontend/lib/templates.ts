// Centralized template presets & skill taxonomy so create/edit pages stay in sync.
// (Future: could be fetched from DB.)

export interface TemplatePreset {
  summary: string
  experience: string
  skills: string
  gradient: string
  bulletPrefix?: string
  tagline: string
  accent: string
}

export const templatePresets: Record<string, TemplatePreset> = {
  'modern-gradient': {
    tagline: 'Polished modern layout mixing subtle gradients with clear hierarchy.',
    summary: 'Full-stack engineer pairing product intuition with scalable architecture expertise.',
    experience: '* Built microservice mesh processing 50M req/day (SLA 99.98%).\n* Drove latency reduction initiative (P95 420ms → 180ms).\n* Shipped personalization engine lifting activation 12%.',
    skills: 'Core: TypeScript, Go, Node.js\nUI: React, Next.js, Tailwind\nData: PostgreSQL, MongoDB, Redis\nInfra: AWS, Docker, Terraform\nPractices: CI/CD, Observability, Perf Tuning',
    gradient: 'from-violet-600/90 to-purple-600/90',
    bulletPrefix: '*',
    accent: 'violet'
  },
  'minimal-focus': {
    tagline: 'Clean, typographic, minimal surface—content first.',
    summary: 'Backend specialist obsessed with correctness, simplicity and reliability.',
    experience: '- Designed resilient job pipeline (99.95% success).\n- Refactored legacy auth reducing cold starts 40%.\n- Introduced tracing + SLO culture across team.',
    skills: 'Languages: Node.js, Rust, SQL\nPatterns: Event-Driven, CQRS\nTooling: Grafana, OpenTelemetry, k6\nOps: Docker, Linux, Terraform',
    gradient: 'from-slate-700/90 to-slate-800/90',
    bulletPrefix: '-',
    accent: 'slate'
  },
  'executive-impact': {
    tagline: 'Executive tone emphasizing strategy, scale and outcomes.',
    summary: 'Engineering leader scaling platforms, people and predictable delivery.',
    experience: '• Led 14-engineer platform org; consolidation saved 22% infra spend.\n• Launched talent framework raising retention 78% → 91%.\n• Reliability program cut Sev1 incidents 60% YoY.',
    skills: 'Leadership: Org Design, Mentorship\nStrategy: Roadmapping, Budget Planning\nPlatforms: Distributed Systems, Observability\nEnablement: Developer Experience, SLOs',
    gradient: 'from-amber-600/90 to-orange-600/90',
    bulletPrefix: '•',
    accent: 'amber'
  },
  'creative-showcase': {
    tagline: 'Vibrant presentation showcasing UX + product impact.',
    summary: 'Product-minded engineer crafting delightful, accessible interfaces with measurable lift.',
    experience: '→ Shipped design system adopted by 6 product squads.\n→ Optimized critical funnel (+9% conv).\n→ Prototyped AI assistant (+15% session depth).',
    skills: 'UI: React, Framer Motion, Tailwind\nDesign: Accessibility, Design Systems\nCollab: Product Discovery, Rapid Prototyping\nGrowth: A/B Testing, Metrics',
    gradient: 'from-pink-600/90 to-fuchsia-600/90',
    bulletPrefix: '→',
    accent: 'pink'
  }
}

export const skillTaxonomy: Record<string, { label: string; lines: string[] }[]> = {
  violet: [
    { label: 'Core', lines: ['Core: TypeScript, Go, Node.js'] },
    { label: 'Frontend', lines: ['Frontend: React, Next.js, Tailwind'] },
    { label: 'Backend', lines: ['Backend: REST, GraphQL, gRPC'] },
    { label: 'Data', lines: ['Data: PostgreSQL, MongoDB, Redis'] },
    { label: 'Infra', lines: ['Infra: AWS, Docker, Terraform'] },
    { label: 'Practices', lines: ['Practices: CI/CD, Observability, Perf Tuning'] },
  ],
  slate: [
    { label: 'Languages', lines: ['Languages: Node.js, Rust, SQL'] },
    { label: 'Paradigms', lines: ['Paradigms: Event-Driven, CQRS'] },
    { label: 'Tooling', lines: ['Tooling: Grafana, OpenTelemetry, k6'] },
    { label: 'Ops', lines: ['Ops: Docker, Linux, Terraform'] },
    { label: 'Quality', lines: ['Quality: Testing, Code Review, Static Analysis'] },
  ],
  amber: [
    { label: 'Leadership', lines: ['Leadership: Org Design, Mentorship'] },
    { label: 'Strategy', lines: ['Strategy: Roadmapping, Budget Planning'] },
    { label: 'Platforms', lines: ['Platforms: Distributed Systems, Observability'] },
    { label: 'Enablement', lines: ['Enablement: Developer Experience, SLOs'] },
    { label: 'Culture', lines: ['Culture: Psychological Safety, Continuous Improvement'] },
  ],
  pink: [
    { label: 'UI', lines: ['UI: React, Framer Motion, Tailwind'] },
    { label: 'Design', lines: ['Design: Accessibility, Design Systems'] },
    { label: 'Collab', lines: ['Collab: Product Discovery, Rapid Prototyping'] },
    { label: 'Growth', lines: ['Growth: A/B Testing, Metrics'] },
    { label: 'Craft', lines: ['Craft: Micro-interactions, Performance, UX Writing'] },
  ],
}

export function smartMerge(existing: string, preset: string) {
  if (!existing.trim()) return preset
  const existingLines = existing.split(/\n+/).map(l => l.trim())
  const additions = preset.split(/\n+/).filter(l => l.trim() && !existingLines.includes(l.trim()))
  return additions.length ? existing.replace(/\n*$/, '') + '\n' + additions.join('\n') : existing
}

import { getDb } from './mongo'

export interface ResumeDoc {
  _id: string
  userId: string
  title: string
  content: string // placeholder for structured blocks / JSON in future
  targetRole?: string
  templateId?: string
  // Personal / contact details
  fullName?: string
  email?: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  portfolio?: string
  website?: string
  // Professional sections
  summary?: string
  experience?: string
  projects?: string
  education?: string
  certifications?: string
  skills?: string
  achievements?: string
  languages?: string
  publications?: string
  volunteerWork?: string
  interests?: string
  references?: string
  createdAt: Date
  updatedAt: Date
  score?: number // cached AI score
  analysisMeta?: { keywordCoverage?: number; lastAnalyzedAt?: Date }
}

let resumeIndexesCreated = false

export async function resumesCollection() {
  const db = await getDb()
  const col = db.collection<ResumeDoc>('resumes')
  if (!resumeIndexesCreated) {
    await Promise.all([
      col.createIndex({ userId: 1, updatedAt: -1 }),
      col.createIndex({ userId: 1, title: 1 }),
    ])
    resumeIndexesCreated = true
  }
  return col
}

export async function createResume(userId: string, data: { 
  title: string; content: string; targetRole?: string; templateId?: string; 
  fullName?: string; email?: string; phone?: string; location?: string; 
  linkedin?: string; github?: string; portfolio?: string; website?: string;
  summary?: string; experience?: string; projects?: string; education?: string; 
  certifications?: string; skills?: string; achievements?: string; languages?: string;
  publications?: string; volunteerWork?: string; interests?: string; references?: string;
}) {
  const col = await resumesCollection()
  const now = new Date()
  const doc: ResumeDoc = {
    _id: crypto.randomUUID(),
    userId,
    title: data.title,
    content: data.content,
    targetRole: data.targetRole,
    templateId: data.templateId,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    location: data.location,
    linkedin: data.linkedin,
    github: data.github,
    portfolio: data.portfolio,
    website: data.website,
    summary: data.summary,
    experience: data.experience,
    projects: data.projects,
    education: data.education,
    certifications: data.certifications,
    skills: data.skills,
    achievements: data.achievements,
    languages: data.languages,
    publications: data.publications,
    volunteerWork: data.volunteerWork,
    interests: data.interests,
    references: data.references,
    createdAt: now,
    updatedAt: now,
    score: undefined,
    analysisMeta: undefined,
  }
  await col.insertOne(doc)
  return doc
}

export async function listResumes(userId: string, limit = 50) {
  const col = await resumesCollection()
  return col.find({ userId }).sort({ updatedAt: -1 }).limit(limit).toArray()
}

export async function getResume(userId: string, id: string) {
  const col = await resumesCollection()
  return col.findOne({ _id: id, userId })
}

export async function updateResume(userId: string, id: string, patch: Partial<Pick<ResumeDoc, 
  'title' | 'content' | 'targetRole' | 'templateId' | 'fullName' | 'email' | 'phone' | 'location' | 
  'linkedin' | 'github' | 'portfolio' | 'website' | 'summary' | 'experience' | 'projects' | 'education' | 
  'certifications' | 'skills' | 'achievements' | 'languages' | 'publications' | 'volunteerWork' | 'interests' | 'references'>>) {
  const col = await resumesCollection()
  const res = await col.updateOne(
    { _id: id, userId },
    { $set: { ...patch, updatedAt: new Date() } }
  )
  if (res.matchedCount === 0) return null
  return await col.findOne({ _id: id, userId })
}

export async function deleteResume(userId: string, id: string) {
  const col = await resumesCollection()
  await col.deleteOne({ _id: id, userId })
}

// Simple heuristic scoring placeholder; replace with real AI later
export function heuristicScore(content: string) {
  // naive metrics: length, numbers presence, action verbs list match, etc.
  const lengthFactor = Math.min(1, content.length / 3000)
  const numbers = (content.match(/\b\d+%?|\$\d+/g) || []).length
  const numbersFactor = Math.min(1, numbers / 12)
  const verbs = ['led', 'built', 'created', 'optimized', 'designed', 'improved', 'reduced', 'increased']
  const verbMatches = verbs.reduce((acc, v) => acc + (content.toLowerCase().includes(v) ? 1 : 0), 0)
  const verbsFactor = Math.min(1, verbMatches / 8)
  return Math.round((0.4 * lengthFactor + 0.3 * numbersFactor + 0.3 * verbsFactor) * 100)
}

export async function analyzeResume(userId: string, id: string) {
  const col = await resumesCollection()
  const resume = await col.findOne({ _id: id, userId })
  if (!resume) return null
  const combined = [resume.summary, resume.experience, resume.skills].filter(Boolean).join('\n\n') || resume.content
  let score = heuristicScore(combined)
  let breakdown: any | undefined
  // Attempt AI scoring if key present
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (apiKey) {
      const prompt = `You are an experienced technical recruiter. Score the resume content for readiness targeting role: ${resume.targetRole || 'General Software Engineer'}. Provide JSON only with keys: score (0-100 integer), breakdown (object with: impact, clarity, metrics, actionVerbs, keywords), suggestions (array of up to 4 short imperative strings). Do not include any other text. Content:\n${combined.slice(0,6000)}`
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents:[{ parts:[{ text: prompt }] }] }) })
      if (resp.ok) {
        const data = await resp.json()
        const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0])
            if (typeof parsed.score === 'number' && parsed.score >=0 && parsed.score <= 100) score = parsed.score
            breakdown = parsed.breakdown
          } catch {}
        }
      }
    }
  } catch (e) {
    console.error('AI scoring failed, fallback to heuristic', e)
  }
  const keywordCoverage = (() => {
    if (!resume.targetRole) return undefined
    const targetWords = resume.targetRole.toLowerCase().split(/\s+/).filter(Boolean)
    if (!targetWords.length) return undefined
    const lower = combined.toLowerCase()
    const hits = targetWords.filter(w => lower.includes(w)).length
    return Math.round((hits / targetWords.length) * 100)
  })()
  await col.updateOne(
    { _id: id, userId },
    { $set: { score, analysisMeta: { keywordCoverage, lastAnalyzedAt: new Date() } } }
  )
  return { score, keywordCoverage, breakdown }
}

// Lightweight heuristic "improvement" – enhances summary tone, ensures bullets start with action verbs,
// and injects a metric hint if missing. This is a placeholder until a real AI rewrite is integrated.
export async function improveResume(userId: string, id: string) {
  const col = await resumesCollection()
  const resume = await col.findOne({ _id: id, userId })
  if (!resume) return null

  const verbs = ['Led', 'Built', 'Created', 'Optimized', 'Designed', 'Improved', 'Reduced', 'Increased']

  let summary = resume.summary || ''
  if (summary) {
    // Add a results-driven prefix if absent
    if (!/^results?-driven/i.test(summary.trim())) {
      summary = summary.replace(/^/,'Results-driven ') // simple prefix
    }
    // Ensure it ends with a period
    if (!/[.!?]$/.test(summary.trim())) summary = summary.trim() + '.'
  }

  let experience = resume.experience || ''
  if (experience) {
    const lines = experience.split(/\r?\n/).map(l => l.trim()).filter(l => l)
    const improvedLines = lines.map(l => {
      let line = l.replace(/\s+$/,'')
      // Normalize bullet prefix
      if (!/^[-*•]/.test(line)) line = '- ' + line
      // If already has hint, don't duplicate
      const HINT = '(achieved measurable impact)'
      // Ensure action verb
      const body = line.replace(/^[-*•]\s*/, '')
      const firstWord = body.split(/\s+/)[0]
      const hasVerb = verbs.some(v => v.toLowerCase() === firstWord.toLowerCase())
      if (!hasVerb) line = line.replace(/^([-*•]\s*)/, `$1${verbs[0]} `) // deterministic first verb for consistency
      // Metric hint only if no number and no existing hint
      if (!/\d/.test(line) && !line.includes(HINT)) line += ' ' + HINT
      // Trim overly long lines (>220 chars) subtly
      if (line.length > 220) line = line.slice(0, 215).replace(/[,;\s]+$/,'') + '…'
      return line
    })
    experience = improvedLines.join('\n')
  }

  let skills = resume.skills || ''
  if (skills) {
    // Deduplicate comma-separated skills lightly
    const parts = skills.split(/[,\n]/).map(s => s.trim()).filter(Boolean)
    const dedup: string[] = []
    for (const p of parts) {
      if (!dedup.some(d => d.toLowerCase() === p.toLowerCase())) dedup.push(p)
    }
    skills = dedup.join(', ')
  }

  // Attempt AI enhancement via Gemini if key is present
  let aiApplied = false
  let rationale: string | undefined
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (apiKey) {
      const combinedOriginal = {
        summary: summary || '',
        experience: experience || '',
        skills: skills || ''
      }
  const prompt = `You are an expert resume editor. Improve the resume sections.
Return ONLY valid minified JSON with keys: summary, experience, skills, rationale, changeSummary.
changeSummary MUST be an object with keys: bulletsModified, metricsAdded, verbsAdded, skillsDeduplicated.
Rules:
- Preserve factual intent. Do NOT invent employers, titles, or impossible metrics.
- Add numeric or % metrics ONLY if clearly derivable or generic (e.g. \'~15%\').
- Keep experience as bullet list; one bullet per line starting with an action verb.
- Do not add parenthetical hints like (achieved measurable impact).
- Keep professional concise tone.
- Skills should be comma separated, deduplicated, grouped lightly by category if possible.
Existing JSON: ${JSON.stringify(combinedOriginal)}`
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      })
      if (resp.ok) {
        const data = await resp.json()
        const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
        // Attempt to extract JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0])
            if (parsed.summary) summary = parsed.summary.trim()
            if (parsed.experience) experience = parsed.experience.trim()
            if (parsed.skills) skills = parsed.skills.trim()
            if (parsed.rationale) rationale = String(parsed.rationale).slice(0, 1000)
            aiApplied = true
          } catch {}
        }
      }
    }
  } catch (e) {
    // Silent fallback to heuristic-only improvements
    console.error('AI improve error', e)
  }

  const patch: Partial<ResumeDoc> = {}
  if (summary && summary !== resume.summary) patch.summary = summary
  if (experience && experience !== resume.experience) patch.experience = experience
  if (skills && skills !== resume.skills) patch.skills = skills
  if (Object.keys(patch).length === 0) {
    return { improved: false, resume, ai: aiApplied, rationale }
  }
  await col.updateOne({ _id: id, userId }, { $set: { ...patch, updatedAt: new Date() } })
  const updated = await col.findOne({ _id: id, userId })
  return { improved: true, resume: updated, ai: aiApplied, rationale }
}

// New: Generate improvements without applying (for preview dialog)
export async function generateResumeImprovements(userId: string, id: string, options?: { aggressiveness?: 'conservative' | 'moderate' | 'bold' }) {
  const col = await resumesCollection()
  const resume = await col.findOne({ _id: id, userId })
  if (!resume) return null
  const aggressiveness = options?.aggressiveness || 'moderate'
  const originalSummary = resume.summary || ''
  const originalExperience = resume.experience || ''
  const originalSkills = resume.skills || ''

  let improvedSummary = originalSummary
  let improvedExperience = originalExperience
  let improvedSkills = originalSkills

  let aiApplied = false
  let rationale: string | undefined
  let changeSummary: any | undefined
  let bulletMeta: { original: string; improved: string; changed: boolean; metricsAdded: boolean; verbsAdded: boolean }[] = []
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (apiKey) {
      const combinedOriginal = { summary: originalSummary, experience: originalExperience, skills: originalSkills }
      const toneDirective = (
        aggressiveness === 'conservative' ? 'Light edits: tighten wording, minor clarity, keep almost all original phrasing.' :
        aggressiveness === 'bold' ? 'Bold rewrite: restructure sentences for impact, add plausible metrics/quantifiers, remove filler.' :
        'Moderate improvements: strengthen action verbs, add metrics where plausible, remove redundancy.'
      )
      const prompt = `You are a senior resume editor. ${toneDirective}
Return STRICT JSON only with keys: summary, experience, skills, rationale, changeSummary.
changeSummary = { bulletsModified: int, metricsAdded: int, verbsAdded: int, skillsDeduplicated: int }.
Rules:
- NEVER fabricate company names, product names, or confidential data.
- Metrics must be plausible (use approximations like "~15%" if original lacks exact figure) and avoid over-claiming.
- experience MUST be a bullet list: one bullet per line, start with strong verb, no numbering.
- Remove weak starters (Responsible for, Worked on).
- summary: 3-4 concise sentences max, no leading "Results-driven" cliche.
- skills: deduplicate, group similar items with commas; keep categories optional.
- Output compact JSON; DO NOT wrap in markdown fences; no commentary outside JSON.
Original JSON: ${JSON.stringify(combinedOriginal)}`
      const requestBody = { contents: [{ parts: [{ text: prompt }] }] }
      let attempts = 0
      while (attempts < 2 && !aiApplied) {
        attempts++
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) })
        if (resp.ok) {
          const data = await resp.json()
            const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
            const jsonMatch = text.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
              try {
                const parsed = JSON.parse(jsonMatch[0])
                if (parsed.summary) improvedSummary = String(parsed.summary).trim()
                if (parsed.experience) improvedExperience = String(parsed.experience).trim()
                if (parsed.skills) {
                  // Handle cases where model returns array or object for skills
                  if (typeof parsed.skills === 'string') {
                    improvedSkills = parsed.skills.trim()
                  } else if (Array.isArray(parsed.skills)) {
                    improvedSkills = parsed.skills.map((s:any)=>String(s).trim()).filter(Boolean).join(', ')
                  } else if (typeof parsed.skills === 'object') {
                    // Flatten key/value pairs like {Languages:[...], Tools:[...]} -> "Languages: a, b; Tools: c, d"
                    const parts: string[] = []
                    for (const [k,v] of Object.entries(parsed.skills)) {
                      if (Array.isArray(v)) parts.push(`${k}: ${v.map(x=>String(x).trim()).filter(Boolean).join(', ')}`)
                      else if (typeof v === 'string') parts.push(`${k}: ${v.trim()}`)
                    }
                    if (parts.length) improvedSkills = parts.join('; ')
                    else improvedSkills = Object.values(parsed.skills).map(v=>String(v)).join(', ')
                  } else {
                    improvedSkills = String(parsed.skills).trim()
                  }
                }
                if (parsed.rationale) rationale = String(parsed.rationale).slice(0,1000)
                if (parsed.changeSummary) changeSummary = parsed.changeSummary
                aiApplied = true
              } catch {}
            }
        }
      }
    }
  } catch (e) {
    console.error('AI generate improvements error', e)
  }
  // Build bullet meta (even if AI not applied, original vs improved diff)
  const origBullets = (originalExperience || '').split(/\r?\n/).map(b => b.trim()).filter(Boolean)
  const newBullets = (improvedExperience || '').split(/\r?\n/).map(b => b.trim()).filter(Boolean)
  const max = Math.max(origBullets.length, newBullets.length)
  for (let i=0;i<max;i++) {
    const ob = origBullets[i] || ''
    const nb = newBullets[i] || ''
    const changed = ob !== nb
    const metricsAdded = !/(\d|%)/.test(ob) && /(\d|%)/.test(nb)
    const verbs = ['Led','Built','Created','Optimized','Designed','Improved','Reduced','Increased','Implemented','Delivered']
    const verbsAdded = !verbs.some(v => ob.startsWith(v)) && verbs.some(v => nb.startsWith(v))
    bulletMeta.push({ original: ob, improved: nb, changed, metricsAdded, verbsAdded })
  }
  return {
    improvedSections: {
      summary: { original: originalSummary, improved: improvedSummary },
      experience: { original: originalExperience, improved: improvedExperience },
      skills: { original: originalSkills, improved: improvedSkills },
    },
    ai: aiApplied,
    rationale,
    changeSummary,
    bullets: bulletMeta,
    resume
  }
}

// Apply selected improvements (sections array specifying which improved values to persist)
export async function applySelectedImprovements(userId: string, id: string, sections: string[], generated?: Awaited<ReturnType<typeof generateResumeImprovements>>, options?: { aggressiveness?: 'conservative' | 'moderate' | 'bold' }) {
  const col = await resumesCollection()
  const resume = await col.findOne({ _id: id, userId })
  if (!resume) return null
  let improvements = generated
  if (!improvements) improvements = await generateResumeImprovements(userId, id, { aggressiveness: options?.aggressiveness })
  if (!improvements) return null
  const patch: Partial<ResumeDoc> = {}
  if (sections.includes('summary') && improvements.improvedSections.summary.improved && improvements.improvedSections.summary.improved !== resume.summary) patch.summary = improvements.improvedSections.summary.improved
  if (sections.includes('experience') && improvements.improvedSections.experience.improved && improvements.improvedSections.experience.improved !== resume.experience) patch.experience = improvements.improvedSections.experience.improved
  if (sections.includes('skills') && improvements.improvedSections.skills.improved && improvements.improvedSections.skills.improved !== resume.skills) patch.skills = improvements.improvedSections.skills.improved
  if (Object.keys(patch).length === 0) {
    return { improved: false, resume, ai: improvements.ai, rationale: improvements.rationale }
  }
  await col.updateOne({ _id: id, userId }, { $set: { ...patch, updatedAt: new Date() } })
  const updated = await col.findOne({ _id: id, userId })
  return { improved: true, resume: updated, ai: improvements.ai, rationale: improvements.rationale }
}

// Parse raw imported text (from PDF or LaTeX) into structured fields
export async function generateStructuredFromRaw(raw: string) {
  const cleaned = raw.replace(/\t/g, ' ').replace(/\r/g, '')
  
  // Initialize sections storage
  const sections: {[key: string]: string[]} = {
    summary: [],
    experience: [],
    projects: [],
    education: [],
    certifications: [],
    skills: [],
    achievements: [],
    languages: [],
    publications: [],
    volunteerWork: [],
    interests: [],
    references: []
  }
  
  // Split into lines and clean
  const lines = cleaned.split(/\n/).map(l => l.trim()).filter(Boolean)
  let currentSection: string | null = null
  
  // Section detection patterns
  const sectionPatterns = {
    summary: /^(summary|profile|about|objective|career objective|professional summary)\b/i,
    experience: /^(experience|work experience|professional experience|employment|career history)\b/i,
    projects: /^(projects|personal projects|key projects|notable projects)\b/i,
    education: /^(education|academic background|qualifications|degrees)\b/i,
    certifications: /^(certifications|certificates|professional certifications|credentials)\b/i,
    skills: /^(skills|technical skills|technologies|core competencies|expertise)\b/i,
    achievements: /^(achievements|accomplishments|awards|honors|recognition)\b/i,
    languages: /^(languages|language proficiency|spoken languages)\b/i,
    publications: /^(publications|papers|research|articles)\b/i,
    volunteerWork: /^(volunteer|volunteering|community service|volunteer work)\b/i,
    interests: /^(interests|hobbies|personal interests|activities)\b/i,
    references: /^(references|referees)\b/i
  }
  
  // Parse lines into sections
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lower = line.toLowerCase()
    
    // Check if this line is a section header
    let foundSection = null
    for (const [sectionName, pattern] of Object.entries(sectionPatterns)) {
      if (pattern.test(lower)) {
        foundSection = sectionName
        break
      }
    }
    
    if (foundSection) {
      currentSection = foundSection
      continue
    }
    
    // If no section yet, treat as summary
    if (!currentSection) {
      currentSection = 'summary'
    }
    
    // Add line to current section
    if (sections[currentSection]) {
      sections[currentSection].push(line)
    }
  }
  
  // Process each section
  const processSection = (sectionLines: string[], preserveBullets = false) => {
    if (sectionLines.length === 0) return ''
    
    if (preserveBullets) {
      // For experience, projects, achievements - preserve bullet structure
      return sectionLines.map(line => {
        const trimmed = line.trim()
        if (trimmed.match(/^[•·‣⁃▪▫‣※]/)) {
          return `- ${trimmed.replace(/^[•·‣⁃▪▫‣※]\s*/, '')}`
        } else if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
          return `- ${trimmed.replace(/^[-*]\s*/, '')}`
        } else if (trimmed.match(/^\d+\./)) {
          return `- ${trimmed.replace(/^\d+\.\s*/, '')}`
        } else if (trimmed.length > 0 && !trimmed.match(/^[A-Z][^.]*\d{4}/)) {
          // Don't bullet-ize job titles/dates
          return `- ${trimmed}`
        }
        return trimmed
      }).join('\n')
    } else {
      // For other sections, join as sentences or comma-separated
      return sectionLines.join(' ').replace(/\s+/g, ' ').trim()
    }
  }
  
  // Use AI for better parsing if available
  let aiRefined = false
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (apiKey) {
      const prompt = `Parse this resume text into structured JSON with ALL available sections. Use these exact field names: summary, experience, projects, education, certifications, skills, achievements, languages, publications, volunteerWork, interests, references.

Rules:
- ALL fields must be strings, never objects or arrays
- experience, projects, achievements should be bullet points starting with "- "
- skills should be comma-separated list
- education should be formatted as "Degree | School | Year" on separate lines for multiple entries
- summary should be 2-4 sentences
- Return empty string for missing sections
- Return ONLY valid JSON with string values

Resume text:
${raw.slice(0, 15000)}`

      const body = { contents: [{ parts: [{ text: prompt }] }] }
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(body) 
      })
      
      if (resp.ok) {
        const data = await resp.json()
        const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0])
            // Override with AI results if available - ensure all values are strings
            const result: any = {}
            Object.keys(sections).forEach(key => {
              const aiValue = parsed[key]
              if (typeof aiValue === 'string') {
                result[key] = aiValue
              } else if (Array.isArray(aiValue)) {
                // Convert array to string with bullet points
                result[key] = aiValue.map(item => {
                  if (typeof item === 'string') {
                    return item
                  } else if (typeof item === 'object' && item !== null) {
                    // Handle objects in arrays - especially education entries
                    if (key === 'education' && item.degree && item.school) {
                      const parts = []
                      if (item.degree) parts.push(item.degree)
                      if (item.school) parts.push(item.school)
                      if (item.year) parts.push(item.year)
                      return parts.join(' | ')
                    } else {
                      return Object.values(item).filter(Boolean).join(' ')
                    }
                  } else {
                    return String(item)
                  }
                }).filter(Boolean).join('\n')
              } else if (typeof aiValue === 'object' && aiValue !== null) {
                // Convert object to string - handle specific structures
                if (key === 'education' && aiValue.degree && aiValue.school) {
                  // Handle education object with degree/school/year structure
                  const parts = []
                  if (aiValue.degree) parts.push(aiValue.degree)
                  if (aiValue.school) parts.push(aiValue.school)
                  if (aiValue.year) parts.push(aiValue.year)
                  result[key] = parts.join(' | ')
                } else {
                  // Generic object conversion
                  result[key] = Object.values(aiValue).filter(Boolean).join(' ')
                }
              } else {
                // Fallback to heuristic parsing
                result[key] = processSection(sections[key], ['experience', 'projects', 'achievements'].includes(key))
              }
            })
            aiRefined = true
            return { ...result, ai: aiRefined }
          } catch (parseError) {
            console.error('AI JSON parse error:', parseError)
          }
        }
      }
    }
  } catch (e) {
    console.error('AI structuring error', e)
  }
  
  // Fallback to heuristic parsing
  const result = {
    summary: processSection(sections.summary),
    experience: processSection(sections.experience, true),
    projects: processSection(sections.projects, true),
    education: processSection(sections.education),
    certifications: processSection(sections.certifications, true),
    skills: processSection(sections.skills).replace(/[,;]\s+/g, ', '),
    achievements: processSection(sections.achievements, true),
    languages: processSection(sections.languages),
    publications: processSection(sections.publications, true),
    volunteerWork: processSection(sections.volunteerWork, true),
    interests: processSection(sections.interests),
    references: processSection(sections.references),
    ai: aiRefined
  }
  
  return result
}

import { NextRequest, NextResponse } from 'next/server'
import { readSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

interface AIQuestionnaireData {
  fullName: string
  jobTitle: string
  industry: string
  yearsExperience: string
  keySkills: string
  topAchievements: string
  currentRole: string
  companyTypes: string
  targetAudience: string
  goals: string
  personalityStyle: string
  preferredTone: string
  theme: string
}

const themePrompts = {
  modern: "modern, clean, and contemporary style with sleek typography and minimalist design",
  minimal: "minimal and elegant with lots of white space, simple layouts, and subtle typography",
  creative: "bold, artistic, and visually striking with creative layouts and vibrant elements",
  professional: "corporate, formal, and business-focused with traditional layouts and conservative design",
  dark: "dark mode aesthetic with dark backgrounds, light text, and modern contrast",
  colorful: "vibrant, energetic, and colorful with dynamic gradients and engaging visual elements"
}

export async function POST(req: NextRequest) {
  const session = await readSession()
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  
  try {
    const answers: AIQuestionnaireData = await req.json()
    
    // Validate required fields
    const requiredFields = ['fullName', 'jobTitle', 'industry', 'yearsExperience', 'keySkills', 'currentRole', 'topAchievements', 'targetAudience', 'goals', 'personalityStyle', 'preferredTone']
    for (const field of requiredFields) {
      if (!answers[field as keyof AIQuestionnaireData]) {
        return NextResponse.json({ 
          success: false, 
          message: `Missing required field: ${field}` 
        }, { status: 400 })
      }
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        message: 'AI service not available' 
      }, { status: 503 })
    }

    const themeDescription = themePrompts[answers.theme as keyof typeof themePrompts] || themePrompts.modern
    
    const prompt = `Based on the following detailed questionnaire responses, create comprehensive and personalized portfolio content for ${answers.fullName}.

USER PROFILE:
- Name: ${answers.fullName}
- Job Title: ${answers.jobTitle}
- Industry: ${answers.industry}
- Years of Experience: ${answers.yearsExperience}
- Personal Style: ${answers.personalityStyle}
- Preferred Tone: ${answers.preferredTone}

PROFESSIONAL BACKGROUND:
- Current Role: ${answers.currentRole}
- Key Skills: ${answers.keySkills}
- Top Achievements: ${answers.topAchievements}
- Company Types: ${answers.companyTypes}
- Target Audience: ${answers.targetAudience}
- Portfolio Goals: ${answers.goals}

THEME REQUIREMENTS:
Theme: ${answers.theme} - ${themeDescription}

Based on this information, generate highly personalized and authentic portfolio content. Write in the ${answers.preferredTone.toLowerCase()} tone and reflect the ${answers.personalityStyle.toLowerCase()} style. Make everything specific to their actual background and goals.

Generate the following sections as a JSON object:

1. **tagline**: A compelling professional tagline that captures their unique value proposition
2. **bio**: A brief 2-3 sentence hero section introduction
3. **about**: A comprehensive "About Me" section (3-4 paragraphs) that tells their authentic professional story based on their background
4. **experience**: Realistic work experience based on their industry, role, and years of experience (create 3-4 positions that make sense for their career progression)
5. **projects**: 4-5 specific projects relevant to their field and skills, with technologies and outcomes
6. **skills**: Well-organized technical and soft skills based on what they mentioned and their industry
7. **education**: Relevant educational background for their field and experience level
8. **achievements**: Professional accomplishments based on what they shared, plus realistic additional ones
9. **services**: Services they could offer based on their skills and target audience
10. **testimonials**: 2-3 realistic testimonials from the perspective of their target audience
11. **contact**: Professional contact section encouraging their target audience to reach out
12. **metaDescription**: SEO-friendly meta description highlighting their key strengths (max 150 characters)
13. **metaKeywords**: Relevant keywords for their industry and skills

IMPORTANT GUIDELINES:
- Make all content authentic and specific to their actual background
- Use industry-specific terminology relevant to ${answers.industry}
- Reflect their ${answers.yearsExperience} years of experience level
- Target content towards ${answers.targetAudience}
- Support their stated goals: ${answers.goals}
- Write in ${answers.preferredTone} tone with ${answers.personalityStyle} personality
- Ensure content fits the ${answers.theme} theme aesthetic
- All projects and achievements should feel realistic for their background
- Include specific metrics and outcomes where appropriate
- Make testimonials sound authentic and specific

Return ONLY a valid JSON object with the above fields. Do not include any text outside the JSON.`

    console.log('Generating portfolio with Q&A data:', {
      name: answers.fullName,
      title: answers.jobTitle,
      industry: answers.industry,
      theme: answers.theme
    })

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        }
      })
    })

    if (!response.ok) {
      throw new Error(`AI service request failed: ${response.status}`)
    }

    const aiResponse = await response.json()
    const aiText = aiResponse.candidates?.[0]?.content?.parts?.[0]?.text

    if (!aiText) {
      throw new Error('No content generated by AI')
    }

    // Parse the JSON response from AI
    let portfolioData
    try {
      // Clean the response in case there's markdown formatting
      const cleanedText = aiText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      portfolioData = JSON.parse(cleanedText)
      
      // Add the user's basic info to the generated data
      portfolioData.fullName = answers.fullName
      portfolioData.title = `${answers.fullName}'s Portfolio`
      
    } catch (parseError) {
      console.error('AI JSON parse error:', parseError)
      console.error('AI raw response:', aiText)
      throw new Error('Invalid AI response format')
    }

    console.log('Successfully generated portfolio data')
    return NextResponse.json({ 
      success: true, 
      data: portfolioData 
    })

  } catch (error: any) {
    console.error('Portfolio Q&A AI generation error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Generation failed' 
    }, { status: 500 })
  }
}
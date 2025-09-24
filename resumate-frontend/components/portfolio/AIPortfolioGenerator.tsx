import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sparkles, Loader2, ArrowRight, ArrowLeft } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface AIQuestionnaire {
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
}

interface Props {
  onGenerate: (data: any) => void
  theme: string
  isLoading: boolean
}

export default function AIPortfolioGenerator({ onGenerate, theme, isLoading }: Props) {
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [answers, setAnswers] = useState<Partial<AIQuestionnaire>>({})

  const questions = [
    {
      step: 1,
      title: "Basic Information",
      description: "Let's start with the basics",
      fields: [
        { key: 'fullName', label: 'Full Name', type: 'input', required: true },
        { key: 'jobTitle', label: 'Current Job Title/Role', type: 'input', required: true, placeholder: 'e.g., Senior Software Engineer, UX Designer, Marketing Manager' },
        { key: 'industry', label: 'Industry/Field', type: 'input', required: true, placeholder: 'e.g., Technology, Healthcare, Finance, Creative' }
      ]
    },
    {
      step: 2,
      title: "Experience & Skills",
      description: "Tell us about your professional background",
      fields: [
        { key: 'yearsExperience', label: 'Years of Experience', type: 'select', required: true, options: ['0-1', '2-3', '4-6', '7-10', '10+'] },
        { key: 'keySkills', label: 'Key Skills & Technologies', type: 'textarea', required: true, placeholder: 'List your main skills, tools, and technologies. Separate with commas.' },
        { key: 'currentRole', label: 'Current Role Description', type: 'textarea', required: true, placeholder: 'Briefly describe what you do in your current/most recent role' }
      ]
    },
    {
      step: 3,
      title: "Achievements & Goals",
      description: "Highlight your accomplishments",
      fields: [
        { key: 'topAchievements', label: 'Top 3 Professional Achievements', type: 'textarea', required: true, placeholder: 'What are you most proud of? Include metrics, awards, successful projects, etc.' },
        { key: 'companyTypes', label: 'Types of Companies/Projects', type: 'textarea', required: true, placeholder: 'What types of companies have you worked for? What kinds of projects do you excel at?' },
        { key: 'targetAudience', label: 'Target Audience', type: 'textarea', required: true, placeholder: 'Who do you want to attract? (e.g., startups, enterprise clients, specific industries)' }
      ]
    },
    {
      step: 4, 
      title: "Portfolio Style & Goals",
      description: "Let's personalize your portfolio",
      fields: [
        { key: 'goals', label: 'Portfolio Goals', type: 'textarea', required: true, placeholder: 'What do you want this portfolio to achieve? (e.g., land new job, attract clients, showcase work)' },
        { key: 'personalityStyle', label: 'Personal Style', type: 'select', required: true, options: ['Professional & Formal', 'Friendly & Approachable', 'Creative & Innovative', 'Technical & Detail-oriented', 'Leadership-focused'] },
        { key: 'preferredTone', label: 'Preferred Writing Tone', type: 'select', required: true, options: ['Professional', 'Conversational', 'Confident', 'Humble', 'Energetic'] }
      ]
    }
  ]

  const totalSteps = questions.length

  const updateAnswer = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  const canProceed = () => {
    const currentQuestion = questions[currentStep - 1]
    return currentQuestion.fields
      .filter(field => field.required)
      .every(field => answers[field.key as keyof AIQuestionnaire])
  }

  const nextStep = () => {
    if (canProceed() && currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const generatePortfolio = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/generate-portfolio-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...answers, theme })
      })

      const data = await res.json()
      if (data.success) {
        onGenerate(data.data)
        setOpen(false)
        setCurrentStep(1)
        setAnswers({})
        toast({ title: 'Success', description: 'Portfolio generated successfully! Review and customize as needed.' })
      } else {
        throw new Error(data.error || 'Generation failed')
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const renderField = (field: any) => {
    const value = answers[field.key as keyof AIQuestionnaire] || ''

    if (field.type === 'select') {
      return (
        <Select value={value} onValueChange={(val) => updateAnswer(field.key, val)}>
          <SelectTrigger>
            <SelectValue placeholder={`Select ${field.label}`} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((option: string) => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    if (field.type === 'textarea') {
      return (
        <Textarea
          value={value}
          onChange={(e) => updateAnswer(field.key, e.target.value)}
          placeholder={field.placeholder}
          rows={3}
        />
      )
    }

    return (
      <Input
        value={value}
        onChange={(e) => updateAnswer(field.key, e.target.value)}
        placeholder={field.placeholder}
      />
    )
  }

  const currentQuestion = questions[currentStep - 1]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          type="button" 
          variant="outline" 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Generate with AI
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            AI Portfolio Generator
          </DialogTitle>
          <DialogDescription>
            Answer a few questions to generate personalized portfolio content
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{currentQuestion.title}</CardTitle>
              <CardDescription>{currentQuestion.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentQuestion.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {renderField(field)}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={generatePortfolio}
                disabled={!canProceed() || loading}
                className="flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Generate Portfolio
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
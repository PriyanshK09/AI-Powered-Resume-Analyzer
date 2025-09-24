import { notFound } from 'next/navigation'
import { getPortfolioBySlug, incrementPortfolioViews } from '@/lib/portfolios'
import {
  ModernTheme,
  MinimalTheme,
  CreativeTheme,
  ProfessionalTheme,
  DarkTheme,
  ColorfulTheme
} from '@/components/portfolio/themes'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const portfolio = await getPortfolioBySlug(resolvedParams.slug)
  
  if (!portfolio) {
    return {
      title: 'Portfolio Not Found',
      description: 'The requested portfolio could not be found.'
    }
  }

  return {
    title: portfolio.title || `${portfolio.fullName}'s Portfolio`,
    description: portfolio.metaDescription || portfolio.bio || `Professional portfolio of ${portfolio.fullName}`,
    keywords: portfolio.metaKeywords,
    openGraph: {
      title: portfolio.title || `${portfolio.fullName}'s Portfolio`,
      description: portfolio.metaDescription || portfolio.bio || `Professional portfolio of ${portfolio.fullName}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: portfolio.title || `${portfolio.fullName}'s Portfolio`,
      description: portfolio.metaDescription || portfolio.bio || `Professional portfolio of ${portfolio.fullName}`,
    }
  }
}

export default async function PortfolioPage({ params }: Props) {
  const resolvedParams = await params
  const portfolio = await getPortfolioBySlug(resolvedParams.slug)
  
  if (!portfolio) {
    notFound()
  }

  // Increment view count (non-blocking)
  incrementPortfolioViews(resolvedParams.slug).catch(console.error)

  // Render the appropriate theme component
  const themeComponents = {
    modern: ModernTheme,
    minimal: MinimalTheme,
    creative: CreativeTheme,
    professional: ProfessionalTheme,
    dark: DarkTheme,
    colorful: ColorfulTheme
  }

  const ThemeComponent = themeComponents[portfolio.theme as keyof typeof themeComponents] || ModernTheme

  return <ThemeComponent portfolio={portfolio} />
}
import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "ResuMate - AI-Powered Resume Optimization",
  description:
    "Transform your career with AI-optimized resumes. Generate, analyze, and score your resume with advanced AI. Get personalized suggestions and ATS-friendly templates that get you noticed by top employers.",
  keywords:
    "resume builder, AI resume, ATS optimization, resume analyzer, job search, career, resume templates, resume scoring",
  authors: [{ name: "ResuMate Team" }],
  creator: "ResuMate",
  publisher: "ResuMate",
  applicationName: "ResuMate",
  generator: "Next.js",
  metadataBase: new URL("https://resumate.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ResuMate - AI-Powered Resume Optimization",
    description:
      "Land your dream job with AI-optimized resumes. Get personalized suggestions and ATS-friendly templates.",
    url: "https://resumate.com",
    siteName: "ResuMate",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ResuMate - AI-Powered Resume Optimization",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ResuMate - AI-Powered Resume Optimization",
    description:
      "Land your dream job with AI-optimized resumes. Get personalized suggestions and ATS-friendly templates.",
    images: ["/og-image.png"],
    creator: "@resumate",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline theme script to avoid flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {try {const ls = localStorage.getItem('resumate-theme');const mql = window.matchMedia('(prefers-color-scheme: dark)');const theme = ls === 'dark' || (!ls && mql.matches) ? 'dark' : 'light';if(theme==='dark'){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}} catch(_) {}})();`
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
  <link rel="icon" href="/placeholder-logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7c3aed" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}

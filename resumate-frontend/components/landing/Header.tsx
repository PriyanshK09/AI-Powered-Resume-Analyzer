"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Moon, Sun, Bot, Menu, X } from "lucide-react"

interface HeaderProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  scrollY: number
}

export default function Header({ darkMode, setDarkMode, scrollY }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMobileMenu()
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "unset"
    }
  }, [mobileMenuOpen])

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu()
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [mobileMenuOpen])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-[background,backdrop-filter] duration-500">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-center">
          <div className={`header-shell header-shell-base ${scrollY > 40 ? 'header-shell-scrolled' : ''} group`}>            
            <div className="flex items-center justify-between gap-4">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 focus-ring">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-violet-600 flex items-center justify-center shadow-md">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent tracking-tight">ResuMate</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {['Features','Templates','Pricing'].map(item => (
                  <a key={item} href={`#${item.toLowerCase()}`} className="nav-link focus-ring">
                    {item}
                  </a>
                ))}
              </nav>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button aria-label="Toggle theme" onClick={() => setDarkMode(!darkMode)} className="theme-toggle-btn focus-ring">
                  {darkMode ? <Sun className="w-4 h-4 text-violet-600 dark:text-violet-300" /> : <Moon className="w-4 h-4 text-violet-600" />}
                </button>
                <Link href="/auth/signin" className="hidden md:inline-flex">
                  <span className="btn-soft focus-ring">Sign In</span>
                </Link>
                <Link href="/auth/register" className="inline-flex">
                  <Button size="sm" className="relative rounded-full px-5 py-2 text-sm font-medium bg-gradient-to-b from-violet-500 via-violet-600 to-purple-600 shadow-[0_4px_14px_-4px_rgba(109,40,217,0.5)] hover:shadow-[0_6px_22px_-4px_rgba(109,40,217,0.55)] active:scale-[0.97] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2">
                    <span className="flex items-center text-white">Get Started <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" /></span>
                  </Button>
                </Link>
                <button aria-label="Open menu" onClick={toggleMobileMenu} className="lg:hidden theme-toggle-btn focus-ring">
                  <Menu className="w-4 h-4 text-violet-600 dark:text-violet-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-[100] transition-all duration-500 ease-out ${
          mobileMenuOpen
            ? "opacity-100 backdrop-blur-sm bg-black/30 dark:bg-black/60"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobileMenu}
      >
        {/* Slide-in Menu Panel */}
        <div
          ref={menuRef}
          className={`fixed top-0 right-0 h-full w-[60%] max-w-sm bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-gray-200/50 dark:border-slate-700/50 shadow-2xl shadow-violet-500/10 dark:shadow-violet-500/20 transition-all duration-500 ease-out transform ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-slate-700/50">
            <Link href="/" className="flex items-center space-x-3" onClick={closeMobileMenu}>
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 via-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                ResuMate
              </span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeMobileMenu}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-300 group"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300" />
            </Button>
          </div>

          {/* Menu Content */}
          <div className="flex flex-col h-full pt-8 pb-6">
            {/* Navigation Links */}
            <nav className="flex-1 px-6 space-y-2">
              {["Features", "Templates", "Pricing"].map((item, index) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={closeMobileMenu}
                  className="block text-gray-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-300 font-medium py-4 px-4 rounded-2xl hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 dark:hover:from-slate-800/50 dark:hover:to-slate-700/50 transform hover:scale-[1.02] border border-transparent hover:border-violet-100 dark:hover:border-slate-600/50"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(50px)',
                    opacity: mobileMenuOpen ? 1 : 0,
                    transition: `all 0.5s ease-out ${index * 100}ms`
                  }}
                >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{item}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                    </div>
                </a>
              ))}
            </nav>

            {/* Bottom Actions */}
            <div className="px-6 space-y-4 pt-6 border-t border-gray-200 dark:border-slate-700">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                onClick={() => setDarkMode(!darkMode)}
                className="w-full justify-start font-medium rounded-2xl py-4 px-4 transition-all duration-300 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 dark:hover:from-slate-800/50 dark:hover:to-slate-700/50 hover:scale-[1.02] group"
              >
                <div className="flex items-center space-x-3">
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-violet-600 dark:text-violet-400 group-hover:rotate-180 transition-transform duration-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-violet-600 group-hover:-rotate-12 transition-transform duration-500" />
                  )}
                  <span className="text-lg text-gray-700 dark:text-slate-300">
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </span>
                </div>
              </Button>

              {/* Sign In Button */}
              <Link href="/auth/signin" onClick={closeMobileMenu}>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-medium rounded-2xl py-4 px-4 transition-all duration-300 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 dark:hover:from-slate-800/50 dark:hover:to-slate-700/50 hover:scale-[1.02] text-lg text-gray-700 dark:text-slate-300"
                >
                  Sign In
                </Button>
              </Link>

              {/* CTA Button */}
              <Link href="/auth/register" onClick={closeMobileMenu}>
                <Button
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 dark:shadow-violet-500/30 dark:hover:shadow-violet-500/50 transition-all duration-300 font-medium py-4 rounded-2xl text-lg group overflow-hidden text-white"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                  <span className="relative z-10 flex items-center justify-center">
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
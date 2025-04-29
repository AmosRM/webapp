"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { ShinyButton } from "@/components/magicui/shiny-button";

export default function Services() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-background relative">
      {/* Theme Backgrounds */}
      <div className="fixed inset-0 transition-opacity duration-500 pointer-events-none">
        <div 
          className={`absolute inset-0 bg-[url('/images/mountains-light.jpg')] bg-cover bg-center ${
            theme === 'light' ? 'opacity-30' : 'opacity-0'
          }`}
        />
        <div 
          className={`absolute inset-0 bg-[url('/images/stars-dark.jpg')] bg-cover bg-center ${
            theme === 'dark' ? 'opacity-60' : 'opacity-0'
          }`}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Floating Header */}
        <header className="fixed w-full top-0 z-10 bg-background/50 backdrop-blur-sm border-b">
          <div className="container mx-auto flex items-center justify-between p-4">
            <div className="flex items-center gap-8">
              <Link href="/" className="font-bold text-xl">Lumino AI</Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/about" className="text-foreground/60 hover:text-foreground transition-colors">
                  About
                </Link>
                <Link href="/services" className="text-foreground/60 hover:text-foreground transition-colors">
                  Services
                </Link>
                <Link href="/projects" className="text-foreground/60 hover:text-foreground transition-colors">
                  Projects
                </Link>
                <Link href="/contact" className="text-foreground/60 hover:text-foreground transition-colors">
                  Contact
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-background/95 backdrop-blur-sm border-b`}>
            <nav className="container mx-auto py-4 flex flex-col space-y-4">
              <Link 
                href="/about" 
                className="px-4 py-2 text-foreground/60 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/services" 
                className="px-4 py-2 text-foreground/60 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                href="/projects" 
                className="px-4 py-2 text-foreground/60 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Projects
              </Link>
              <Link 
                href="/contact" 
                className="px-4 py-2 text-foreground/60 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        </header>

        <div className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
          {/* Services Introduction */}
          <section className="mb-12">
            <h1 className="text-3xl font-bold mb-4">Comprehensive AI Solutions</h1>
            <p className="text-lg text-muted-foreground mb-12">
              Helping businesses and individuals harness the power of artificial intelligence — efficiently, effectively, and sustainably.
            </p>
          </section>
          {/* Services List */}
          <section className="mb-12">
            <div className="prose dark:prose-invert">
              <h3 className="text-xl font-semibold mt-6 border-b mb-2 flex items-center gap-2">
                <span>🔍</span> AI Consulting
              </h3>
              <p className="font-medium mb-2">Strategic guidance for AI integration.</p>
              <p className="mb-8">
                Work with you to identify high-impact opportunities, assess technical requirements, 
                and design a clear roadmap for successful AI implementation.
              </p>

              <h3 className="text-xl font-semibold mt-6 border-b mb-2 flex items-center gap-2">
                <span>🛠️</span> Custom AI Development
              </h3>
              <p className="font-medium mb-2">Tailored solutions for real-world problems.</p>
              <p className="mb-8">
                Automations, AI workflows, and smart agents — solving real-world business problems.
                I build production-ready AI solutions that work.
              </p>

              <h3 className="text-xl font-semibold mt-6 border-b mb-2 flex items-center gap-2">
                <span>📚</span> AI Training
              </h3>
              <p className="font-medium mb-2">Upskill your team with hands-on learning.</p>
              <p className="mb-8">
                Through workshops and custom training, I help your team build AI literacy and 
                develop the confidence to use AI tools effectively in daily workflows.
              </p>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Ready to Work Together?</h2>
            <p className="text-muted-foreground mb-6">
            Let&apos;s discuss how I can help you achieve your goals.
            </p>
            <div className="space-x-4">
              <Link href="/contact">
                <ShinyButton>
                  Contact Me
                </ShinyButton>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
} 
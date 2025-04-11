"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { ShinyButton } from "@/components/magicui/shiny-button";

export default function Services() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

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
                <Link href="/contact" className="text-foreground/60 hover:text-foreground transition-colors">
                  Contact
                </Link>
              </nav>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-0.5 flex">
              <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-full transition-colors ${theme === 'light' ? 'bg-white shadow-sm' : ''}`}
              >
                <Sun className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-full transition-colors ${theme === 'dark' ? 'bg-white shadow-sm' : ''}`}
              >
                <Moon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
          {/* Services Introduction */}
          <section className="mb-12">
            <p className="text-lg text-muted-foreground mb-6">
              Provide comprehensive AI solutions to help businesses and individuals leverage the power of artificial intelligence.
            </p>
          </section>
          {/* Services List */}
          <section className="mb-12">
            <div className="prose dark:prose-invert">
              <h3 className="text-xl font-semibold mt-6 border-b mb-2">AI Consulting</h3>
              <p className="mb-4">
                Strategic guidance for implementing AI solutions in your business. We help you identify opportunities, 
                assess requirements, and develop a roadmap for AI integration.
              </p>

              <h3 className="text-xl font-semibold mt-6 border-b mb-2">Custom AI Development</h3>
              <p className="mb-4">
                Building tailored AI solutions for your specific needs. From chatbots to predictive analytics, 
                we create custom AI applications that solve your unique challenges.
              </p>

              <h3 className="text-xl font-semibold mt-6 border-b mb-2">AI Training</h3>
              <p className="mb-4">
                Workshops and training sessions for your team. We help your organization build AI literacy 
                and develop the skills needed to work effectively with AI tools.
              </p>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Ready to Work Together?</h2>
            <p className="text-muted-foreground mb-6">
              Let&apos;s discuss how we can help you achieve your goals.
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
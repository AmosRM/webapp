"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function Home() {
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
          className={`absolute inset-0 bg-[url('/images/mountains-lightmedium.jpeg')] bg-cover bg-center ${
            theme === 'light' ? 'opacity-30' : 'opacity-0'
          }`}
        />
        <div 
          className={`absolute inset-0 bg-[url('/images/stars-darkmedium.jpeg')] bg-cover bg-center ${
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

        {/* Main Content */}
        <div className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
          {/* Hero Section */}
          <section className="py-12 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Lumino AI Studio
            </h1>
            <div className="space-y-0.1">
              <p className="text-xl text-foreground/80">
                Leverage Your Expertise
              </p>
              <p className="text-xl text-foreground/80">
                Gain Productivity with AI tools
              </p>
            </div>
          </section>

          {/* About You Section */}
          <section id="about" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">About you</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>
                You&apos;re eager to learn about AI
              </li>
              <li>
                You want to build with expert help
              </li>
              <li>
                You have an idea, but don&apos;t know how to build it
              </li>
            </ul>
          </section>

          {/* About Me Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">About me</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>
                Content forward (show don&apos;t tell), your friend in AI
              </li>
              <li>
                Teach busineses how to leverage AI
              </li>
              <li>
                I help you build your AI culture
              </li>
              <li>
                Building AI products, with AI tools
              </li>
            </ul>
          </section>

          {/* What I Do Section */}
          <section id="services" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">What I do</h2>
            <ul className="space-y-2 list-disc text-foreground/80 pl-5">
              <li>
                <strong>Share</strong>: Latest AI tools and resources that matter
              </li>
              <li>
                <strong>Educate</strong>: Team or one-on-one sessions to help you learn about AI
              </li>
              <li>
                <strong>Build</strong>: Building prototypes and projects with AI, fast!
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
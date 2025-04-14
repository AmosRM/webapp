"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { BentoGrid, BentoCard } from "@/components/magicui/bento-grid";
import { FileTextIcon, BrainCircuitIcon, Blocks, RocketIcon } from "lucide-react";

export default function Projects() {
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
                <Link href="/projects" className="text-foreground/60 hover:text-foreground transition-colors">
                  Projects
                </Link>
                <Link href="/contact" className="text-foreground/60 hover:text-foreground transition-colors">
                  Contact
                </Link>
              </nav>
            </div>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
          </div>
        </header>

        <div className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
          {/* Projects Introduction */}
          <section className="mb-12">
            <h1 className="text-3xl font-bold mb-4">Featured Projects</h1>
            <p className="text-lg text-muted-foreground mb-12">
              Explore our portfolio of AI-powered solutions and innovations.
            </p>
          </section>

          {/* Projects Grid */}
          <section className="mb-24">
            <BentoGrid className="mx-auto">
              <BentoCard
                name="AI Content Assistant"
                description="A smart writing assistant that helps create, edit, and enhance content using advanced AI models."
                background={<div className="flex-1 w-full h-full bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl" />}
                Icon={FileTextIcon}
                href="#"
                cta="View Project"
                className="md:col-span-2"
              />
              <BentoCard
                name="Build a prototype"
                description="Build a prototype for your specific needs with AI tools."
                background={<div className="flex-1 w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl" />}
                Icon={Blocks}
                href="#"
                cta="View Project"
                className="col-span-1"
              />
              <BentoCard
                name="AI Meeting Assistant"
                description="Automated meeting notes, action items, and summaries powered by speech recognition and AI."
                background={<div className="flex-1 w-full h-full bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl" />}
                Icon={RocketIcon}
                href="#"
                cta="View Project"
                className="col-span-1"
              />
              <BentoCard
                name="Custom ChatGPT Agents"
                description="Specialized AI agents trained on your business data and processes for enhanced automation."
                background={<div className="flex-1 w-full h-full bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl" />}
                Icon={BrainCircuitIcon}
                href="#"
                cta="View Project"
                className="md:col-span-2"
              />
            </BentoGrid>
          </section>
        </div>
      </div>
    </main>
  );
} 
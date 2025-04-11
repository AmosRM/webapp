"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { BentoGrid, BentoCard } from "@/components/magicui/bento-grid";
import { RocketIcon, FileTextIcon, VideoIcon, BrainCircuitIcon, Blocks } from "lucide-react";
import Link from "next/link";
import build from "next/dist/build";

export default function Home() {
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
                Gain productivity with AI tools
              </p>
            </div>
          </section>

          {/* About You Section */}
          <section id="about" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">About you</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>
                You're eager to learn about AI, but you don't know where to start
              </li>
              <li>
                You want to build products with expert help
              </li>
            </ul>
          </section>

          {/* About Me Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">About me</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>
                Content forward (show don't tell), your friend in AI
              </li>
              <li>
                Teach busineses how to leverage AI
              </li>
              <li>
                I help you build your AI culture
              </li>
              <li>
                Building AI products with AI tools
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

          {/* Projects Section */}
          <section id="projects" className="mb-12">
            <h2 className="text-2xl font-bold mb-8 text-center pb-2">Featured Projects</h2>
            <BentoGrid className="mx-auto">
              <BentoCard
                name="AI Content Assistant"
                description="A smart writing assistant that helps create, edit, and enhance content using advanced AI models."
                background={<div className="flex-1 w-full h-full bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl" />}
                Icon={FileTextIcon}
                href="#"
                cta="Learn more"
                className="md:col-span-2"
              />
              <BentoCard
                name="Build a prototype"
                description="Build a prototype for your specific needs with AI tools."
                background={<div className="flex-1 w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl" />}
                Icon={Blocks}
                href="#"
                cta="Learn more"
                className="col-span-1"
              />
              <BentoCard
                name="AI Meeting Assistant"
                description="Automated meeting notes, action items, and summaries powered by speech recognition and AI."
                background={<div className="flex-1 w-full h-full bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl" />}
                Icon={RocketIcon}
                href="#"
                cta="Learn more"
                className="col-span-1"
              />
              <BentoCard
                name="Custom ChatGPT Agents"
                description="Specialized AI agents trained on your business data and processes for enhanced automation."
                background={<div className="flex-1 w-full h-full bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl" />}
                Icon={BrainCircuitIcon}
                href="#"
                cta="Learn more"
                className="md:col-span-2"
              />
            </BentoGrid>
          </section>
        </div>
      </div>
    </main>
  );
}
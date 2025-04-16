"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/animated-background";

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

          {/* Animated Background Section */}
          <section className="mb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatedBackground
                className="rounded-lg bg-zinc-300/80 dark:bg-zinc-700"
                opacity={1}
                transition={{
                  type: 'spring',
                  bounce: 0.2,
                  duration: 0.6,
                }}
                enableHover
              >
                {[
                  {
                    id: 'card-1',
                    title: <Link href="/projects/ai-image-generator">AI Image Generator</Link>,
                    description: 'Create stunning visuals with AI-powered image generation.',
                  },
                  {
                    id: 'card-2',
                    title: 'Data Analysis Tool',
                    description: 'Transform raw data into actionable insights with AI.',
                  },
                  {
                    id: 'card-3',
                    title: 'Voice Assistant',
                    description: 'Build custom voice assistants for your business needs.',
                  },
                  {
                    id: 'card-4',
                    title: 'AI Recommendation Engine',
                    description: 'Personalize user experiences with smart recommendations.',
                  },
                  {
                    id: 'card-5',
                    title: 'Document Processing',
                    description: 'Automate document extraction and processing workflows.',
                  },
                  {
                    id: 'card-6',
                    title: 'Sentiment Analysis',
                    description: 'Analyze customer feedback and social media sentiment.',
                  },
                ].map((item, index) => (
                  <div key={index} data-id={item.id}>
                    <div className="flex select-none flex-col space-y-1 p-4">
                      <h3 className="text-base font-medium text-zinc-800 dark:text-zinc-50">
                        {item.title}
                      </h3>
                      <p className="text-base text-zinc-600 dark:text-zinc-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </AnimatedBackground>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
} 
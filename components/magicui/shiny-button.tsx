"use client";

import { cn } from "@/lib/utils";
import { motion, MotionProps, type AnimationProps } from "motion/react";
import React from "react";

const animationProps = {
  initial: { "--x": "100%", scale: 0.8 },
  animate: { "--x": "-100%", scale: 1 },
  whileTap: { scale: 0.95 },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 0.2,
    type: "spring",
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: "spring",
      stiffness: 200,
      damping: 5,
      mass: 0.5,
    },
  },
} as AnimationProps;

interface ShinyButtonProps
  extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps>,
    MotionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "subtle" | "bold";
}

export const ShinyButton = React.forwardRef<
  HTMLButtonElement,
  ShinyButtonProps
>(({ children, className, variant = "default", ...props }, ref) => {
  // Different styling intensities based on the variant
  const variantStyles = {
    subtle: {
      buttonClass: "dark:bg-[radial-gradient(circle_at_50%_0%,var(--primary)/15%_0%,transparent_60%)] dark:hover:shadow-[0_0_20px_var(--primary)/15%]",
      textClass: "text-[rgb(0,0,0,70%)] dark:text-[rgb(255,255,255,90%)]",
      glowIntensity: "linear-gradient(-75deg,var(--primary)/15% calc(var(--x)+20%),var(--primary)/60% calc(var(--x)+25%),var(--primary)/15% calc(var(--x)+100%))",
    },
    default: {
      buttonClass: "border border-[var(--primary)/20%] dark:bg-[radial-gradient(circle_at_50%_0%,var(--primary)/20%_0%,transparent_70%)] dark:hover:shadow-[0_0_25px_var(--primary)/25%]",
      textClass: "text-[rgb(0,0,0,80%)] dark:text-[rgb(255,255,255,95%)]",
      glowIntensity: "linear-gradient(-75deg,var(--primary)/25% calc(var(--x)+20%),var(--primary)/70% calc(var(--x)+25%),var(--primary)/25% calc(var(--x)+100%))",
    },
    bold: {
      buttonClass: "bg-[var(--primary)/5%] border border-[var(--primary)/30%] dark:bg-[radial-gradient(circle_at_50%_0%,var(--primary)/30%_0%,transparent_80%)] dark:hover:shadow-[0_0_30px_var(--primary)/40%]",
      textClass: "text-[rgb(0,0,0,90%)] font-semibold dark:text-white",
      glowIntensity: "linear-gradient(-75deg,var(--primary)/40% calc(var(--x)+20%),var(--primary)/90% calc(var(--x)+25%),var(--primary)/40% calc(var(--x)+100%))",
    }
  };

  const currentStyle = variantStyles[variant];

  return (
    <motion.button
      ref={ref}
      className={cn(
        "relative rounded-lg px-6 py-2 font-medium backdrop-blur-xl transition-shadow duration-300 ease-in-out hover:shadow-md",
        currentStyle.buttonClass,
        className,
      )}
      {...animationProps}
      {...props}
    >
      <span
        className={cn(
          "relative block size-full text-sm uppercase tracking-wide dark:font-medium",
          currentStyle.textClass
        )}
        style={{
          maskImage:
            "linear-gradient(-75deg,var(--primary) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),var(--primary) calc(var(--x) + 100%))",
        }}
      >
        {children}
      </span>
      <span
        style={{
          mask: "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box exclude,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
          WebkitMask:
            "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box exclude,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
          backgroundImage: currentStyle.glowIntensity,
        }}
        className="absolute inset-0 z-10 block rounded-[inherit] p-px"
      ></span>
    </motion.button>
  );
});

ShinyButton.displayName = "ShinyButton";

"use client";

import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import type { ReactNode } from "react";

import {
  sectionReveal,
  sectionRevealLeft,
  sectionRevealRight,
  sectionRevealScale,
  TALA_VIEWPORT,
} from "./tala-motion";

type RevealVariant =
  | "up"
  | "left"
  | "right"
  | "scale";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  amount?: number;
  once?: boolean;
};

const variants: Record<RevealVariant, Variants> = {
  up: sectionReveal,
  left: sectionRevealLeft,
  right: sectionRevealRight,
  scale: sectionRevealScale,
};

export default function ScrollReveal({
  children,
  className,
  variant = "up",
  delay = 0,
  duration,
  amount = TALA_VIEWPORT.amount,
  once = true,
}: ScrollRevealProps) {
  const reducedMotion = useReducedMotion();

  const selectedVariant = variants[variant];

  if (reducedMotion) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  const customVariants: Variants = {
    initial: selectedVariant.initial,
    animate: {
      ...(
        typeof selectedVariant.whileInView === "object"
          ? selectedVariant.whileInView
          : {}
      ),
      transition: {
        duration: duration ?? 1.1,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={customVariants}
      initial="initial"
      whileInView="animate"
      viewport={{
        once,
        amount,
        margin: "0px 0px -60px 0px",
      }}
    >
      {children}
    </motion.div>
  );
}


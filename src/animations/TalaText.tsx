
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type TalaTextProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "none";
  once?: boolean;
};

export default function TalaText({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  direction = "up",
  once = true,
}: TalaTextProps) {
  const reducedMotion = useReducedMotion();

  const offset =
    direction === "up"
      ? 14
      : direction === "down"
        ? -14
        : 0;

  return (
    <motion.div
      className={className}
      initial={
        reducedMotion
          ? false
          : {
              opacity: 0,
              y: offset,
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once,
        amount: 0.25,
      }}
      transition={{
        duration: reducedMotion ? 0 : duration,
        delay: reducedMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

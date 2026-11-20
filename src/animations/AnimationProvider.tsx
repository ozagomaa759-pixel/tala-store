
"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type AnimationProviderProps = {
  children: ReactNode;
};

export default function AnimationProvider({
  children,
}: AnimationProviderProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
                y: 10,
              }
        }
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={
          shouldReduceMotion
            ? undefined
            : {
                opacity: 0,
                y: -6,
              }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }
        }
        style={{ minHeight: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}


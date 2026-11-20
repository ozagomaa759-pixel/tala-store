
"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { TALA_EASE } from "./tala-motion";

type AnimationProviderProps = {
  children: ReactNode;
};

export default function AnimationProvider({
  children,
}: AnimationProviderProps) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={
          reducedMotion
            ? false
            : {
                opacity: 0,
                y: 16,
                filter: "blur(5px)",
              }
        }
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        }}
        exit={
          reducedMotion
            ? undefined
            : {
                opacity: 0,
                y: -10,
                filter: "blur(3px)",
              }
        }
        transition={
          reducedMotion
            ? { duration: 0 }
            : {
                duration: 0.65,
                ease: TALA_EASE,
              }
        }
        style={{
          minHeight: "100%",
          width: "100%",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

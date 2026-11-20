
"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

const STORAGE_KEY = "tala-opening-seen";

export default function TalaOpening() {
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    try {
      const alreadySeen =
        sessionStorage.getItem(STORAGE_KEY);

      if (alreadySeen) {
        setReady(true);
        return;
      }

      setVisible(true);

      const timer = window.setTimeout(() => {
        setVisible(false);
        setReady(true);

        try {
          sessionStorage.setItem(STORAGE_KEY, "true");
        } catch {
          // Opening experience still works without storage.
        }
      }, reducedMotion ? 300 : 1600);

      return () => window.clearTimeout(timer);
    } catch {
      setReady(true);
    }
  }, [reducedMotion]);

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F4F0E9] text-[#211F1B]"
            initial={{ opacity: 1 }}
            exit={
              reducedMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    scale: 1.025,
                    transition: {
                      duration: 0.85,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  }
            }
          >
            <motion.div
              className="overflow-hidden"
              initial={
                reducedMotion
                  ? false
                  : { opacity: 0, y: 28 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reducedMotion ? 0 : 1.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.h1
                className="font-serif text-6xl tracking-[0.28em] sm:text-8xl"
                initial={
                  reducedMotion
                    ? false
                    : { letterSpacing: "0.5em" }
                }
                animate={{ letterSpacing: "0.28em" }}
                transition={{
                  duration: reducedMotion ? 0 : 1.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                TALA
              </motion.h1>
            </motion.div>

            <motion.div
              className="mt-7 h-px w-20 bg-[#9A8D7A]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: reducedMotion ? 0 : 0.9,
                delay: reducedMotion ? 0 : 0.7,
              }}
            />

            <motion.p
              className="mt-5 text-[9px] tracking-[0.42em] text-[#827969] sm:text-[10px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: reducedMotion ? 0 : 0.8,
                delay: reducedMotion ? 0 : 1,
              }}
            >
              LUXURY FASHION
            </motion.p>

            <motion.div
              className="absolute bottom-10 text-[8px] tracking-[0.3em] text-[#9A8D7A]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{
                delay: reducedMotion ? 0 : 1.3,
              }}
            >
              AN EXPRESSION OF DISTINCTION
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!ready && (
        <div
          className="pointer-events-none fixed inset-0 z-[9998] bg-[#F4F0E9]"
          aria-hidden="true"
        />
      )}
    </>
  );
}


"use client";

import {
  motion,
  useReducedMotion,
} from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

type TalaImageProps = {
  children: ReactNode;
  className?: string;
  imageClassName?: string;
  reveal?: boolean;
  hoverZoom?: boolean;
  delay?: number;
  duration?: number;
  radius?: string;
  overlay?: boolean;
};

export default function TalaImage({
  children,
  className = "",
  imageClassName = "",
  reveal = true,
  hoverZoom = true,
  delay = 0,
  duration = 1.2,
  radius = "0px",
  overlay = false,
}: TalaImageProps) {
  const reducedMotion = useReducedMotion();

  const wrapperStyle: CSSProperties = {
    overflow: "hidden",
    borderRadius: radius,
    position: "relative",
  };

  return (
    <motion.div
      className={className}
      style={wrapperStyle}
      initial={
        reveal && !reducedMotion
          ? {
              opacity: 0,
              clipPath: "inset(8% 4% 8% 4%)",
            }
          : false
      }
      whileInView={{
        opacity: 1,
        clipPath: "inset(0% 0% 0% 0%)",
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: reducedMotion ? 0 : duration,
        delay: reducedMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div
        className={imageClassName}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
        initial={false}
        whileHover={
          hoverZoom && !reducedMotion
            ? { scale: 1.055 }
            : undefined
        }
        transition={{
          duration: 1.1,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>

      {overlay && (
        <motion.div
          className="pointer-events-none absolute inset-0 bg-black/10"
          initial={{ opacity: 0 }}
          whileHover={{
            opacity: reducedMotion ? 0 : 1,
          }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.div>
  );
}

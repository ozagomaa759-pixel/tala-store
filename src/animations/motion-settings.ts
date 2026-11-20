
import type { Transition } from "framer-motion";

// ============================================
// TALA — QUIET LUXURY MOTION SETTINGS
// ============================================

export const TALA_MOTION = {
  ease: [0.22, 1, 0.36, 1] as const,

  duration: {
    instant: 0.18,
    quick: 0.28,
    normal: 0.55,
    elegant: 0.8,
    cinematic: 1.15,
  },

  distance: {
    subtle: 8,
    normal: 16,
    editorial: 24,
  },

  scale: {
    hover: 1.015,
    image: 1.035,
    entrance: 0.985,
  },

  stagger: {
    subtle: 0.06,
    normal: 0.1,
    editorial: 0.14,
  },
} as const;

export const TALA_TRANSITION = {
  subtle: {
    duration: TALA_MOTION.duration.normal,
    ease: TALA_MOTION.ease,
  },

  elegant: {
    duration: TALA_MOTION.duration.elegant,
    ease: TALA_MOTION.ease,
  },

  cinematic: {
    duration: TALA_MOTION.duration.cinematic,
    ease: TALA_MOTION.ease,
  },

  hover: {
    duration: TALA_MOTION.duration.quick,
    ease: TALA_MOTION.ease,
  },
} satisfies Record<string, Transition>;

// ============================================
// VIEWPORT SETTINGS
// ============================================

export const TALA_VIEWPORT_SETTINGS = {
  once: true,
  amount: 0.2,
  margin: "0px 0px -50px 0px",
} as const;

// ============================================
// REDUCED MOTION SETTINGS
// ============================================

export const TALA_REDUCED_MOTION = {
  initial: false,
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
  },
  transition: {
    duration: 0,
  },
} as const;

// ============================================
// CONSISTENT HOVER SETTINGS
// ============================================

export const TALA_HOVER = {
  button: {
    scale: TALA_MOTION.scale.hover,
    transition: TALA_TRANSITION.hover,
  },

  image: {
    scale: TALA_MOTION.scale.image,
    transition: {
      duration: TALA_MOTION.duration.cinematic,
      ease: TALA_MOTION.ease,
    },
  },

  card: {
    y: -3,
    transition: TALA_TRANSITION.subtle,
  },
} as const;

// ============================================
// EDITORIAL REVEAL SETTINGS
// ============================================

export const TALA_REVEAL = {
  hidden: {
    opacity: 0,
    y: TALA_MOTION.distance.normal,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: TALA_TRANSITION.elegant,
  },
} as const;

// ============================================
// IMAGE REVEAL SETTINGS
// ============================================

export const TALA_IMAGE_REVEAL = {
  hidden: {
    opacity: 0,
    scale: TALA_MOTION.scale.entrance,
  },

  visible: {
    opacity: 1,
    scale: 1,
    transition: TALA_TRANSITION.cinematic,
  },
} as const;


import type { Transition, Variants } from "framer-motion";

// ============================================
// TALA — SIGNATURE MOTION SYSTEM
// Quiet Luxury / Editorial / Cinematic
// ============================================

export const TALA_EASE = [0.22, 1, 0.36, 1] as const;
export const TALA_SOFT_EASE = [0.25, 0.1, 0.25, 1] as const;

export const TALA_TRANSITIONS = {
  cinematic: {
    duration: 1.1,
    ease: TALA_EASE,
  },
  elegant: {
    duration: 0.75,
    ease: TALA_EASE,
  },
  smooth: {
    duration: 0.55,
    ease: TALA_EASE,
  },
  quick: {
    duration: 0.3,
    ease: TALA_EASE,
  },
  slow: {
    duration: 1.5,
    ease: TALA_EASE,
  },
  image: {
    duration: 1.4,
    ease: TALA_EASE,
  },
} satisfies Record<string, Transition>;

// --------------------------------------------
// PAGE ENTRANCES
// --------------------------------------------

export const pageReveal: Variants = {
  initial: {
    opacity: 0,
    y: 18,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: TALA_TRANSITIONS.elegant,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: TALA_TRANSITIONS.quick,
  },
};

export const cinematicPageReveal: Variants = {
  initial: {
    opacity: 0,
    scale: 0.985,
    filter: "blur(8px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: TALA_TRANSITIONS.cinematic,
  },
  exit: {
    opacity: 0,
    scale: 1.01,
    filter: "blur(5px)",
    transition: TALA_TRANSITIONS.smooth,
  },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: TALA_TRANSITIONS.elegant,
  },
  exit: { opacity: 0 },
};

export const fadeUp: Variants = {
  initial: {
    opacity: 0,
    y: 35,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: TALA_TRANSITIONS.elegant,
  },
};

export const fadeDown: Variants = {
  initial: {
    opacity: 0,
    y: -25,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: TALA_TRANSITIONS.elegant,
  },
};

export const fadeLeft: Variants = {
  initial: {
    opacity: 0,
    x: 35,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: TALA_TRANSITIONS.elegant,
  },
};

export const fadeRight: Variants = {
  initial: {
    opacity: 0,
    x: -35,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: TALA_TRANSITIONS.elegant,
  },
};

// --------------------------------------------
// EDITORIAL TEXT
// --------------------------------------------

export const titleReveal: Variants = {
  initial: {
    opacity: 0,
    y: 65,
    clipPath: "inset(0 0 100% 0)",
  },
  animate: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0% 0)",
    transition: {
      duration: 1.15,
      ease: TALA_EASE,
    },
  },
};

export const subtitleReveal: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    letterSpacing: "0.28em",
  },
  animate: {
    opacity: 1,
    y: 0,
    letterSpacing: "0.12em",
    transition: {
      duration: 1,
      delay: 0.25,
      ease: TALA_EASE,
    },
  },
};

export const wordReveal: Variants = {
  initial: {
    opacity: 0,
    y: "100%",
  },
  animate: {
    opacity: 1,
    y: "0%",
    transition: TALA_TRANSITIONS.cinematic,
  },
};

export const letterReveal: Variants = {
  initial: {
    opacity: 0,
    y: 18,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.035,
      duration: 0.65,
      ease: TALA_EASE,
    },
  }),
};

// --------------------------------------------
// STAGGERED CONTENT
// --------------------------------------------

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.12,
    },
  },
};

export const slowStaggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

export const fastStaggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 28,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: TALA_TRANSITIONS.elegant,
  },
};

// --------------------------------------------
// IMAGE ANIMATIONS
// --------------------------------------------

export const imageReveal: Variants = {
  initial: {
    opacity: 0,
    scale: 1.12,
    clipPath: "inset(8% 5% 8% 5%)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    clipPath: "inset(0% 0% 0% 0%)",
    transition: TALA_TRANSITIONS.image,
  },
};

export const imageZoom: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.055,
    transition: {
      duration: 1.2,
      ease: TALA_EASE,
    },
  },
};

export const imageDrift: Variants = {
  initial: {
    scale: 1.08,
    x: 0,
  },
  animate: {
    scale: 1,
    x: -8,
    transition: {
      duration: 9,
      ease: "easeInOut",
    },
  },
};

export const imageFade: Variants = {
  initial: {
    opacity: 0,
    scale: 1.04,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: TALA_TRANSITIONS.image,
  },
};

// --------------------------------------------
// PRODUCT CARDS
// --------------------------------------------

export const productCard: Variants = {
  initial: {
    opacity: 0,
    y: 35,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: TALA_TRANSITIONS.elegant,
  },
  hover: {
    y: -7,
    transition: TALA_TRANSITIONS.smooth,
  },
};

export const productImage: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.045,
    transition: TALA_TRANSITIONS.image,
  },
};

export const productDetailsReveal: Variants = {
  initial: {
    opacity: 0,
    y: 14,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: TALA_TRANSITIONS.elegant,
  },
};

export const productQuickView: Variants = {
  initial: {
    opacity: 0,
    y: 15,
  },
  hover: {
    opacity: 1,
    y: 0,
    transition: TALA_TRANSITIONS.smooth,
  },
};

// --------------------------------------------
// BUTTONS & INTERACTIONS
// --------------------------------------------

export const luxuryButton: Variants = {
  rest: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.015,
    y: -2,
    transition: TALA_TRANSITIONS.quick,
  },
  tap: {
    scale: 0.975,
    transition: {
      duration: 0.15,
    },
  },
};

export const underlineReveal: Variants = {
  rest: {
    scaleX: 0,
    originX: 0,
  },
  hover: {
    scaleX: 1,
    transition: TALA_TRANSITIONS.smooth,
  },
};

export const iconInteraction: Variants = {
  rest: {
    rotate: 0,
    scale: 1,
  },
  hover: {
    rotate: 7,
    scale: 1.08,
    transition: TALA_TRANSITIONS.quick,
  },
  tap: {
    scale: 0.9,
  },
};

// --------------------------------------------
// NAVIGATION
// --------------------------------------------

export const navigationReveal: Variants = {
  initial: {
    opacity: 0,
    y: -12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: TALA_EASE,
    },
  },
};

export const menuPanel: Variants = {
  closed: {
    opacity: 0,
    x: "100%",
    transition: TALA_TRANSITIONS.smooth,
  },
  open: {
    opacity: 1,
    x: "0%",
    transition: TALA_TRANSITIONS.elegant,
  },
};

export const menuOverlay: Variants = {
  closed: {
    opacity: 0,
  },
  open: {
    opacity: 1,
    transition: TALA_TRANSITIONS.smooth,
  },
};

export const menuItem: Variants = {
  closed: {
    opacity: 0,
    x: 25,
  },
  open: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.08,
      duration: 0.55,
      ease: TALA_EASE,
    },
  }),
};

// --------------------------------------------
// MODALS & DRAWERS
// --------------------------------------------

export const modalBackdrop: Variants = {
  closed: {
    opacity: 0,
  },
  open: {
    opacity: 1,
    transition: TALA_TRANSITIONS.smooth,
  },
};

export const modalContent: Variants = {
  closed: {
    opacity: 0,
    y: 25,
    scale: 0.97,
  },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: TALA_TRANSITIONS.elegant,
  },
};

export const drawerRight: Variants = {
  closed: {
    x: "100%",
  },
  open: {
    x: 0,
    transition: TALA_TRANSITIONS.elegant,
  },
};

export const drawerBottom: Variants = {
  closed: {
    y: "100%",
  },
  open: {
    y: 0,
    transition: TALA_TRANSITIONS.elegant,
  },
};

// --------------------------------------------
// COLOR EXPERIENCE
// --------------------------------------------

export const colorSwatch: Variants = {
  rest: {
    scale: 1,
    borderRadius: "50%",
  },
  hover: {
    scale: 1.12,
    transition: TALA_TRANSITIONS.quick,
  },
  selected: {
    scale: 1.16,
    borderRadius: "50%",
    transition: TALA_TRANSITIONS.smooth,
  },
};

export const colorExperience: Variants = {
  initial: {
    opacity: 0,
    filter: "blur(5px)",
  },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.65,
      ease: TALA_EASE,
    },
  },
  exit: {
    opacity: 0,
    filter: "blur(5px)",
    transition: {
      duration: 0.3,
    },
  },
};

export const colorBackground: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: TALA_TRANSITIONS.cinematic,
  },
};

// --------------------------------------------
// CART & CHECKOUT
// --------------------------------------------

export const cartItem: Variants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: TALA_TRANSITIONS.elegant,
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: TALA_TRANSITIONS.quick,
  },
};

export const cartBadge: Variants = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 18,
    },
  },
};

export const confirmationReveal: Variants = {
  initial: {
    opacity: 0,
    scale: 0.94,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: TALA_EASE,
    },
  },
};

// --------------------------------------------
// SECTION REVEALS
// --------------------------------------------

export const sectionReveal: Variants = {
  initial: {
    opacity: 0,
    y: 50,
  },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: TALA_TRANSITIONS.cinematic,
  },
};

export const sectionRevealLeft: Variants = {
  initial: {
    opacity: 0,
    x: -45,
  },
  whileInView: {
    opacity: 1,
    x: 0,
    transition: TALA_TRANSITIONS.cinematic,
  },
};

export const sectionRevealRight: Variants = {
  initial: {
    opacity: 0,
    x: 45,
  },
  whileInView: {
    opacity: 1,
    x: 0,
    transition: TALA_TRANSITIONS.cinematic,
  },
};

export const sectionRevealScale: Variants = {
  initial: {
    opacity: 0,
    scale: 0.94,
  },
  whileInView: {
    opacity: 1,
    scale: 1,
    transition: TALA_TRANSITIONS.cinematic,
  },
};

// --------------------------------------------
// FLOATING & AMBIENT MOTION
// --------------------------------------------

export const gentleFloat: Variants = {
  initial: {
    y: 0,
  },
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const slowFloat: Variants = {
  initial: {
    y: 0,
    rotate: 0,
  },
  animate: {
    y: [0, -12, 0],
    rotate: [0, 0.5, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const ambientPulse: Variants = {
  initial: {
    opacity: 0.65,
  },
  animate: {
    opacity: [0.65, 1, 0.65],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// --------------------------------------------
// LOADING & STATUS
// --------------------------------------------

export const loadingReveal: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: TALA_TRANSITIONS.smooth,
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

export const successMark: Variants = {
  initial: {
    pathLength: 0,
    opacity: 0,
  },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: TALA_EASE,
    },
  },
};

// --------------------------------------------
// SCROLL SETTINGS
// --------------------------------------------

export const TALA_VIEWPORT = {
  once: true,
  amount: 0.18,
  margin: "0px 0px -70px 0px",
} as const;

export const TALA_REDUCED_VIEWPORT = {
  once: true,
  amount: 0.05,
} as const;

// --------------------------------------------
// RESPONSIVE MOTION HELPERS
// --------------------------------------------

export function getTalaMotion(
  reducedMotion: boolean
) {
  if (reducedMotion) {
    return {
      initial: false,
      animate: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: "none",
      },
      transition: {
        duration: 0,
      },
    };
  }

  return {
    initial: "initial",
    animate: "animate",
    transition: TALA_TRANSITIONS.elegant,
  };
}

// --------------------------------------------
// ANIMATION PRESETS
// --------------------------------------------

export const TALA_MOTION_PRESETS = {
  page: pageReveal,
  cinematicPage: cinematicPageReveal,
  fade: fadeIn,
  fadeUp,
  fadeDown,
  fadeLeft,
  fadeRight,
  title: titleReveal,
  subtitle: subtitleReveal,
  word: wordReveal,
  image: imageReveal,
  imageZoom,
  product: productCard,
  productImage,
  button: luxuryButton,
  navigation: navigationReveal,
  menu: menuPanel,
  modal: modalContent,
  drawer: drawerRight,
  color: colorExperience,
  cart: cartItem,
  section: sectionReveal,
  float: gentleFloat,
  pulse: ambientPulse,
} as const;

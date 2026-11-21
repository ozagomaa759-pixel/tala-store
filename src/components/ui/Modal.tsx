
"use client";

import {
  useEffect,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnBackdrop?: boolean;
};

const sizeStyles = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
};

export default function Modal({
  open,
  onClose,
  children,
  title,
  size = "md",
  closeOnBackdrop = true,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => {
      const dialog = document.querySelector<HTMLElement>(
        '[role="dialog"][data-tala-modal="true"]'
      );

      dialog?.focus();
    }, 50);

    return () => window.clearTimeout(timer);
  }, [open]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/55 p-3 backdrop-blur-[2px] sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (
              closeOnBackdrop &&
              event.target === event.currentTarget
            ) {
              onClose();
            }
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title || "TALA dialog"}
            tabIndex={-1}
            data-tala-modal="true"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={`relative max-h-[90vh] w-full overflow-y-auto bg-[#FAF8F5] shadow-2xl outline-none ${sizeStyles[size]}`}
          >
            <div className="sticky top-0 z-10 flex min-h-14 items-center justify-between border-b border-[#E9E1D7] bg-[#FAF8F5] px-5 sm:px-7">
              {title ? (
                <h2 className="font-serif text-lg text-[#39352F]">
                  {title}
                </h2>
              ) : (
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#8C7B68]">
                  TALA
                </span>
              )}

              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="flex h-9 w-9 items-center justify-center text-[#62584D] transition-colors hover:bg-[#EEE8E0]"
              >
                <X size={19} strokeWidth={1.4} />
              </button>
            </div>

            <div className="p-5 sm:p-7">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}



"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";

export type ToastType = "success" | "error" | "info";

type ToastProps = {
  open: boolean;
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
};

const styles = {
  success: {
    icon: CheckCircle2,
    iconColor: "text-emerald-700",
    background: "bg-[#F1F5EF]",
  },
  error: {
    icon: XCircle,
    iconColor: "text-red-700",
    background: "bg-[#FAEEEE]",
  },
  info: {
    icon: Info,
    iconColor: "text-[#8A755E]",
    background: "bg-[#F4EFE8]",
  },
};

export default function Toast({
  open,
  message,
  type = "success",
  onClose,
  duration = 3500,
}: ToastProps) {
  useEffect(() => {
    if (!open || duration <= 0) return;

    const timer = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timer);
  }, [open, duration, onClose]);

  const config = styles[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.97 }}
          transition={{ duration: 0.22 }}
          className="fixed right-4 top-5 z-[160] w-[calc(100%-2rem)] max-w-sm"
        >
          <div
            className={`flex items-center gap-3 rounded-xl border border-[#E8DED1] p-4 shadow-xl ${config.background}`}
          >
            <Icon size={20} className={config.iconColor} />

            <p className="flex-1 text-sm font-medium text-[#40372F]">
              {message}
            </p>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close notification"
              className="rounded-full p-1 text-[#75695D] transition hover:bg-black/5"
            >
              <X size={17} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


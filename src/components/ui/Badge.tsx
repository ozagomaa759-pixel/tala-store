
import type { HTMLAttributes } from "react";

type BadgeVariant =
  | "new"
  | "bestSeller"
  | "soldOut"
  | "sale"
  | "neutral"
  | "success";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  size?: "sm" | "md";
};

const styles: Record<BadgeVariant, string> = {
  new: "bg-[#F0E8DD] text-[#725C45]",
  bestSeller: "bg-[#39352F] text-white",
  soldOut: "bg-[#E8E5E1] text-[#77716A]",
  sale: "bg-[#925F50] text-white",
  neutral: "bg-white/90 text-[#39352F]",
  success: "bg-[#E5EDE4] text-[#52694E]",
};

export default function Badge({
  children,
  variant = "neutral",
  size = "sm",
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "font-medium uppercase tracking-[0.14em]",
        "whitespace-nowrap",
        size === "sm"
          ? "px-2.5 py-1 text-[8px]"
          : "px-3.5 py-1.5 text-[9px]",
        styles[variant],
        className,
      ].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}


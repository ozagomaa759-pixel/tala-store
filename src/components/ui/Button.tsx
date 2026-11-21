
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "text";

type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#292620] text-white border border-[#292620] hover:bg-[#49443B] hover:border-[#49443B]",
  secondary:
    "bg-[#EAE3D9] text-[#39352F] border border-[#EAE3D9] hover:bg-[#DED4C8]",
  outline:
    "bg-transparent text-[#39352F] border border-[#B9AA98] hover:bg-[#292620] hover:text-white hover:border-[#292620]",
  text:
    "bg-transparent text-[#39352F] border border-transparent hover:text-[#92785E]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-9 px-4 text-[9px]",
  md: "min-h-11 px-6 text-[10px]",
  lg: "min-h-14 px-8 text-[10px]",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={[
        "inline-flex items-center justify-center gap-3",
        "font-medium uppercase tracking-[0.18em]",
        "transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[#A58B70] focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? "w-full" : "",
        className,
      ].filter(Boolean).join(" ")}
      {...props}
    >
      {loading ? (
        <>
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Loading</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}


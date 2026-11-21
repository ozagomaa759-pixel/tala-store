
import type { HTMLAttributes } from "react";

type LoaderProps = HTMLAttributes<HTMLDivElement> & {
  label?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
};

const sizes = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-11 w-11 border-[3px]",
};

export default function Loader({
  label = "Loading",
  size = "md",
  fullScreen = false,
  className = "",
  ...props
}: LoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "flex flex-col items-center justify-center gap-4",
        fullScreen ? "min-h-[70vh] w-full" : "",
        className,
      ].filter(Boolean).join(" ")}
      {...props}
    >
      <div className="relative flex items-center justify-center">
        <span
          className={`${sizes[size]} animate-spin rounded-full border-[#DED4C8] border-t-[#39352F]`}
        />
      </div>

      {label && (
        <span className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#8C7B68]">
          {label}
        </span>
      )}

      <span className="sr-only">{label}</span>
    </div>
  );
}


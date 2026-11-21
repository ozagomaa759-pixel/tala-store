
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="relative flex min-h-[34px] w-full items-center justify-center bg-[#e9e3da] px-4 py-2 text-center text-[#39352f]">
      <Link
        href="/products"
        className="group inline-flex items-center justify-center gap-2 text-[9px] font-medium uppercase tracking-[0.18em] transition-opacity hover:opacity-65 sm:text-[10px]"
      >
        <span>Discover the TALA collection</span>
        <ArrowRight
          size={12}
          strokeWidth={1.5}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}


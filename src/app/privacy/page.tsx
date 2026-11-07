import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] px-6 py-20 text-[#332A23]">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-12 inline-flex items-center gap-2 text-sm text-[#81766B] hover:text-black"
        >
          <ArrowLeft size={16} />
          Back Home
        </Link>

        <LockKeyhole
          size={30}
          className="mb-6 text-[#A58B68]"
        />

        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#A58B68]">
          Your Privacy Matters
        </p>

        <h1 className="text-4xl font-light md:text-6xl">
          Privacy Policy
        </h1>

        <p className="mt-6 text-sm leading-8 text-[#81766B]">
          TALA is committed to respecting the privacy of
          visitors and customers. This page outlines the
          information that our store may need to handle
          when its services become active.
        </p>

        <div className="mt-12 space-y-9 border-t border-[#E5DDD2] pt-10">
          <section>
            <h2 className="text-xl font-medium">
              Information We May Collect
            </h2>
            <p className="mt-3 text-sm leading-8 text-[#81766B]">
              When account and ordering services are activated,
              information such as contact details, delivery
              information, and order details may be collected.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium">
              How Information May Be Used
            </h2>
            <p className="mt-3 text-sm leading-8 text-[#81766B]">
              Information may be used to manage customer
              accounts, process orders, provide support,
              and improve the shopping experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium">
              Data Protection
            </h2>
            <p className="mt-3 text-sm leading-8 text-[#81766B]">
              Appropriate security measures must be
              implemented before collecting real customer
              information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium">
              Contact
            </h2>
            <p className="mt-3 text-sm leading-8 text-[#81766B]">
              For privacy-related questions, please visit
              our contact page.
            </p>

            <Link
              href="/contact"
              className="mt-4 inline-block text-sm underline underline-offset-4"
            >
              Contact TALA
            </Link>
          </section>
        </div>

        <p className="mt-12 border-t border-[#E5DDD2] pt-6 text-xs leading-6 text-[#A09589]">
          This is a draft page, not a finalized legal privacy
          policy. It must be reviewed and completed before
          collecting customer data.
        </p>
      </div>
    </main>
  );
}

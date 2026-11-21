
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  LockKeyhole,
  ShieldCheck,
  UserRound,
  Database,
  ShoppingBag,
  MessageCircle,
} from "lucide-react";

const sections = [
  {
    number: "01",
    title: "Information We Collect",
    icon: UserRound,
    paragraphs: [
      "When you place an order with TALA, we may collect the information you provide, including your full name, phone number, city, delivery address, and order details.",
      "You do not need to create an account or provide a password to shop with TALA.",
    ],
  },
  {
    number: "02",
    title: "How We Use Your Information",
    icon: ShoppingBag,
    paragraphs: [
      "We use your information to process and confirm orders, arrange delivery, contact you about your purchase, respond to customer service requests, and maintain order records.",
      "We aim to collect only information that is relevant to providing our store services.",
    ],
  },
  {
    number: "03",
    title: "Order Records & Storage",
    icon: Database,
    paragraphs: [
      "Order and customer details may be stored in our store management systems so that TALA can manage orders, follow up on deliveries, and provide customer support.",
      "We retain information for as long as it is reasonably needed for these purposes or as required by applicable law.",
    ],
  },
  {
    number: "04",
    title: "Payment Information",
    icon: ShieldCheck,
    paragraphs: [
      "TALA currently offers Cash on Delivery. Payment is made when your order is delivered.",
      "We do not ask you to enter payment card details during the current checkout process.",
    ],
  },
  {
    number: "05",
    title: "Data Protection",
    icon: LockKeyhole,
    paragraphs: [
      "We take the privacy of our customers seriously and work to protect the information handled through our store systems.",
      "No online service can guarantee absolute security. Please contact us if you have a concern about the information associated with your order.",
    ],
  },
  {
    number: "06",
    title: "Your Questions & Requests",
    icon: MessageCircle,
    paragraphs: [
      "If you have a question about your personal information or would like to make a privacy-related request, contact TALA through our official Instagram account.",
      "We may need to verify your identity or order details before responding to a request involving customer information.",
    ],
  },
];

const INSTAGRAM_URL = "https://www.instagram.com/tala__luxury/";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F5F1EB] text-[#24221F]">
      <section className="relative isolate overflow-hidden bg-[#24221F] text-[#F5F1EB]">
        <div className="pointer-events-none absolute -right-32 -top-36 -z-10 h-[480px] w-[480px] rounded-full border border-white/10 sm:h-[620px] sm:w-[620px]" />

        <div className="pointer-events-none absolute -right-12 -top-16 -z-10 h-[320px] w-[320px] rounded-full border border-white/10" />

        <div className="mx-auto max-w-[1400px] px-6 pb-20 pt-16 sm:px-10 sm:pb-28 sm:pt-24 lg:px-20">
          <Link
            href="/"
            className="mb-16 inline-flex min-h-10 items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60 transition hover:text-[#D8ED83]"
          >
            <ArrowLeft size={15} />
            Back to TALA
          </Link>

          <div className="flex items-center gap-3">
            <span className="h-px w-9 bg-[#D8ED83]" />
            <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#D8ED83]">
              YOUR PRIVACY MATTERS
            </p>
          </div>

          <h1 className="mt-8 max-w-5xl font-serif text-[clamp(3.5rem,10vw,8rem)] font-light leading-[0.9] tracking-[-0.06em]">
            YOUR TRUST
            <br />
            <span className="italic text-[#D8ED83]">
              matters.
            </span>
          </h1>

          <p className="mt-9 max-w-xl text-sm leading-8 text-white/55 sm:text-base">
            Your information deserves care. Here is how TALA
            handles the details you share when shopping with us.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10 sm:py-28">
        <div className="mb-12 border-b border-[#DED7CC] pb-8">
          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#89965D]">
            PRIVACY AT TALA
          </p>

          <h2 className="mt-4 font-serif text-4xl font-light tracking-[-0.04em] sm:text-5xl">
            Simple. Clear. Respectful.
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-8 text-[#82796F]">
            You can shop without creating an account. We only
            request the information needed to handle your
            order and provide the services you ask for.
          </p>
        </div>

        <div className="divide-y divide-[#DED7CC] border-y border-[#DED7CC]">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <article
                key={section.number}
                className="grid gap-6 py-9 sm:grid-cols-[70px_1fr] sm:gap-8 sm:py-11"
              >
                <div className="flex items-center gap-4 sm:block">
                  <span className="font-serif text-xl italic text-[#A5B76B]">
                    {section.number}
                  </span>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAE6DD] text-[#59633D] sm:mt-5">
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-light tracking-[-0.025em] sm:text-3xl">
                    {section.title}
                  </h3>

                  <div className="mt-4 max-w-3xl space-y-4">
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-sm leading-8 text-[#82796F]"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-14 bg-[#EAE6DD] p-7 sm:p-10">
          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#89965D]">
            NEED TO SPEAK WITH US?
          </p>

          <h2 className="mt-4 font-serif text-3xl font-light tracking-[-0.04em] sm:text-4xl">
            Your privacy is important.
          </h2>

          <p className="mt-4 max-w-xl text-xs leading-7 text-[#82796F]">
            For privacy questions or requests related to your
            information, reach out through our official
            Instagram account.
          </p>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex min-h-12 items-center justify-center gap-3 bg-[#24221F] px-6 text-[9px] font-semibold uppercase tracking-[0.17em] text-white transition hover:bg-[#42483B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#24221F]"
          >
            Contact TALA
            <ArrowUpRight size={15} />
          </a>
        </div>

        <p className="mt-8 text-[10px] leading-6 text-[#9A9186]">
          This policy describes TALA&apos;s current website and
          ordering practices. It should be reviewed and
          updated whenever our services or data practices
          change. Applicable privacy and consumer protection
          laws remain in effect.
        </p>
      </section>

      <footer className="bg-[#24221F] px-6 py-10 text-center text-[#F5F1EB]">
        <Link
          href="/"
          className="font-serif text-3xl font-light tracking-[0.3em]"
        >
          TALA
        </Link>

        <p className="mt-3 text-[8px] uppercase tracking-[0.3em] text-white/40">
          PLAYFUL BY NATURE. LUXURY BY CHOICE.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-x-7 gap-y-3 text-[9px] uppercase tracking-[0.15em] text-white/55">
          <Link href="/policies" className="transition hover:text-[#D8ED83]">
            Policies
          </Link>
          <Link href="/terms" className="transition hover:text-[#D8ED83]">
            Terms
          </Link>
          <Link href="/returns" className="transition hover:text-[#D8ED83]">
            Returns
          </Link>
          <Link href="/contact" className="transition hover:text-[#D8ED83]">
            Contact
          </Link>
        </div>

        <p className="mt-7 text-[8px] tracking-[0.18em] text-white/30">
          © {new Date().getFullYear()} TALA. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </main>
  );
}

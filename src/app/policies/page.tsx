import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

const policies = [
  {
    title: "Shipping Policy",
    description:
      "Shipping destinations, delivery times, and delivery fees will be announced before online ordering becomes available.",
  },
  {
    title: "Returns & Exchanges",
    description:
      "Our return and exchange conditions will be published before customers can place orders.",
  },
  {
    title: "Privacy Policy",
    description:
      "Customer information must be handled securely and used only for clearly stated store purposes. A complete privacy policy will be provided before account registration is activated.",
  },
  {
    title: "Terms & Conditions",
    description:
      "The store's terms, order conditions, and customer responsibilities will be published before the store launches.",
  },
];

export default function PoliciesPage() {
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

        <div className="mb-14">
          <ShieldCheck
            size={30}
            className="mb-6 text-[#A58B68]"
          />

          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#A58B68]">
            TALA Boutique
          </p>

          <h1 className="text-4xl font-light md:text-6xl">
            Store Policies
          </h1>

          <p className="mt-5 text-sm leading-8 text-[#81766B]">
            Important information about shopping with TALA.
          </p>
        </div>

        <div className="space-y-5">
          {policies.map((policy) => (
            <section
              key={policy.title}
              className="border border-[#E5DDD2] bg-white/60 p-8"
            >
              <h2 className="text-xl font-medium">
                {policy.title}
              </h2>

              <p className="mt-4 text-sm leading-8 text-[#81766B]">
                {policy.description}
              </p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

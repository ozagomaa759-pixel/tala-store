import Link from "next/link";
import { ArrowRight, Layers3, Shirt, Sparkles } from "lucide-react";

const collections = [
  { name: "Sets", eyebrow: "THE COORDINATED EDIT", description: "Thoughtfully coordinated pieces, designed to bring effortless refinement to every moment.", href: "/collections/sets", icon: Layers3 },
  { name: "Jackets", eyebrow: "THE OUTERWEAR EDIT", description: "Distinctive layers and timeless silhouettes that complete the TALA look.", href: "/collections/jackets", icon: Shirt },
  { name: "All Collection", eyebrow: "THE COMPLETE TALA EDIT", description: "Explore every piece in the collection and discover the details that feel like you.", href: "/collections/all-pieces", icon: Sparkles },
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F8F6F2] text-[#302A25]">
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto mb-14 max-w-2xl text-center sm:mb-20">
          <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.42em] text-[#9A8877]">TALA LUXURY FASHION</p>
          <h1 className="text-4xl font-light tracking-[0.08em] sm:text-6xl">The Collections</h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-[#81776E] sm:text-base">A considered edit of pieces shaped by simplicity, confidence and timeless style. Discover the collection that speaks to you.</p>
          <div className="mx-auto mt-8 h-px w-16 bg-[#C9BBAE]" />
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {collections.map((collection, index) => {
            const Icon = collection.icon;
            return (
              <Link key={collection.name} href={collection.href} className="group relative flex min-h-[330px] flex-col justify-between overflow-hidden border border-[#E6E0D8] bg-[#FDFCF9] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#C8B9AA] hover:shadow-[0_22px_60px_rgba(55,43,32,0.08)] sm:min-h-[390px] sm:p-9">
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border border-[#EEE8E0] transition-transform duration-700 group-hover:scale-125" />
                <div className="relative flex items-start justify-between"><span className="text-[10px] tracking-[0.3em] text-[#A39485]">0{index + 1}</span><Icon aria-hidden="true" size={23} strokeWidth={1.2} className="text-[#9A8877] transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-8deg]" /></div>
                <div className="relative mt-16">
                  <p className="mb-4 text-[9px] font-medium tracking-[0.3em] text-[#A39485]">{collection.eyebrow}</p>
                  <h2 className="text-3xl font-light tracking-[0.06em] sm:text-4xl">{collection.name}</h2>
                  <p className="mt-5 max-w-sm text-sm leading-7 text-[#81776E]">{collection.description}</p>
                  <span className="mt-9 inline-flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.24em] text-[#554A40]">Explore collection <ArrowRight size={15} strokeWidth={1.4} className="transition-transform duration-300 group-hover:translate-x-2" /></span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

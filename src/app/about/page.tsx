
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const values = [
  {
    number: "01",
    title: "A little different.",
    description:
      "We believe personal style should feel like you. Unexpected details, confident choices, and pieces that bring something new to your wardrobe.",
  },
  {
    number: "02",
    title: "Playful, always.",
    description:
      "Fashion should be fun. We love a fresh perspective, a little personality, and the freedom to make every look your own.",
  },
  {
    number: "03",
    title: "The details matter.",
    description:
      "From the way a collection is presented to the experience of shopping, we believe the little things make a difference.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F1EB] text-[#24221F]">
      <Header />

      {/* Hero */}
      <section className="relative isolate flex min-h-[650px] items-end overflow-hidden bg-[#777168] sm:min-h-[760px]">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_75%_25%,#B9AA95_0%,transparent_42%),linear-gradient(135deg,#81776B,#4E4942)]" />

        <div className="absolute -right-28 -top-28 -z-10 h-[520px] w-[520px] rounded-full border border-white/15 sm:h-[720px] sm:w-[720px]" />

        <div className="absolute -right-8 top-0 -z-10 h-[380px] w-[380px] rounded-full border border-white/15 sm:h-[560px] sm:w-[560px]" />

        <div className="absolute right-[12%] top-[12%] -z-10 select-none font-serif text-[220px] font-light tracking-[-0.12em] text-white/[0.08] sm:text-[360px]">
          T.
        </div>

        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#211F1C]/85 via-[#211F1C]/15 to-transparent" />

        <div className="mx-auto w-full max-w-[1600px] px-6 pb-16 pt-32 text-white sm:px-12 sm:pb-24 lg:px-20">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-10 bg-[#D8ED83]" />
            <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-white/75">
              A LITTLE ABOUT US
            </p>
          </div>

          <h1 className="max-w-6xl font-serif text-[clamp(4.2rem,12vw,11rem)] font-light leading-[0.82] tracking-[-0.07em]">
            NOT JUST
            <br />
            ANOTHER
            <br />
            <span className="text-[#D8ED83]">LOOK.</span>
          </h1>

          <div className="mt-12 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <p className="max-w-md text-sm leading-8 text-white/75 sm:text-base">
              A point of view. A little personality.
              A different way to express yourself.
              Welcome to the world of TALA.
            </p>

            <a
              href="#our-world"
              className="group inline-flex w-fit items-center gap-4 border-b border-white/50 pb-3 text-[9px] font-semibold uppercase tracking-[0.22em] transition hover:border-[#D8ED83]"
            >
              Discover our world
              <ArrowDown
                size={15}
                className="transition-transform group-hover:translate-y-1"
              />
            </a>
          </div>
        </div>

        <span className="absolute right-7 top-9 hidden text-[8px] uppercase tracking-[0.3em] text-white/60 sm:block sm:right-12">
          TALA / EST. IN STYLE
        </span>
      </section>

      {/* Intro */}
      <section
        id="our-world"
        className="mx-auto grid max-w-[1500px] gap-14 px-6 py-24 sm:px-10 sm:py-32 lg:grid-cols-[0.8fr_1.2fr] lg:gap-28 lg:px-20"
      >
        <div>
          <p className="flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#89965D]">
            <Sparkles size={14} />
            THE TALA POINT OF VIEW
          </p>

          <h2 className="mt-7 font-serif text-5xl font-light leading-[1.05] tracking-[-0.05em] sm:text-7xl">
            Style has
            <br />
            <span className="italic text-[#9BAA6A]">
              no rules.
            </span>
          </h2>
        </div>

        <div className="flex flex-col justify-center">
          <p className="font-serif text-2xl font-light leading-relaxed tracking-[-0.025em] sm:text-3xl">
            TALA is for the days you want to keep it simple,
            and the moments you feel like doing something different.
          </p>

          <p className="mt-8 max-w-2xl text-sm leading-8 text-[#81786E]">
            We see fashion as a way to express who you are,
            without needing to explain it. Our world brings
            together playful energy and a considered aesthetic,
            creating a space to discover pieces that feel
            personal, fresh, and effortlessly yours.
          </p>

          <p className="mt-5 max-w-2xl text-sm leading-8 text-[#81786E]">
            No complicated rules. No need to fit into one
            definition. Just your style, your mood, and
            your own way of wearing it.
          </p>
        </div>
      </section>

      {/* Statement */}
      <section className="relative overflow-hidden bg-[#D8ED83] px-6 py-24 sm:px-10 sm:py-32">
        <div className="pointer-events-none absolute -right-20 -top-32 h-[400px] w-[400px] rounded-full border border-[#24221F]/10 sm:h-[600px] sm:w-[600px]" />

        <div className="relative mx-auto max-w-[1400px]">
          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#59633D]">
            OUR LITTLE MANIFESTO
          </p>

          <h2 className="mt-10 max-w-6xl font-serif text-[clamp(3rem,8vw,8rem)] font-light leading-[0.92] tracking-[-0.065em]">
            Playful by nature.
            <br />
            <span className="italic">Luxury by choice.</span>
          </h2>

          <div className="mt-12 flex flex-col justify-between gap-8 border-t border-[#24221F]/20 pt-7 sm:flex-row sm:items-end">
            <p className="max-w-md text-xs leading-7 text-[#59633D]">
              We like contrasts. Soft and bold. Simple and
              unexpected. Everyday pieces with their own
              personality.
            </p>

            <span className="font-serif text-5xl italic text-[#59633D]/60">
              T.
            </span>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-[1500px] px-6 py-24 sm:px-10 sm:py-32 lg:px-20">
        <div className="mb-16 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#89965D]">
              WHAT WE BELIEVE
            </p>

            <h2 className="mt-5 max-w-2xl font-serif text-5xl font-light leading-tight tracking-[-0.05em] sm:text-7xl">
              A feeling in
              <br />
              every detail.
            </h2>
          </div>

          <p className="max-w-sm text-xs leading-7 text-[#81786E]">
            The TALA perspective is built around a few simple
            ideas that shape the way we see personal style.
          </p>
        </div>

        <div className="grid border-t border-[#DCD5CB] md:grid-cols-3">
          {values.map((value, index) => (
            <article
              key={value.number}
              className={`py-10 md:px-8 lg:py-14 ${
                index > 0 ? "md:border-l md:border-[#DCD5CB]" : ""
              }`}
            >
              <span className="font-serif text-sm italic text-[#9BAA6A]">
                {value.number}
              </span>

              <h3 className="mt-10 font-serif text-3xl font-light tracking-[-0.035em] sm:text-4xl">
                {value.title}
              </h3>

              <p className="mt-6 max-w-sm text-xs leading-8 text-[#81786E]">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section className="bg-[#EAE4DA] px-6 py-24 sm:px-10 sm:py-28 lg:px-20">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#89965D]">
                FIND YOUR OWN WAY
              </p>

              <h2 className="mt-5 font-serif text-5xl font-light tracking-[-0.05em] sm:text-7xl">
                Meet the collections.
              </h2>
            </div>

            <p className="max-w-sm text-xs leading-7 text-[#81786E]">
              Different moods, different moments.
              Find the pieces that speak your language.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Link
              href="/collections/sets"
              className="group relative flex min-h-[390px] flex-col justify-between overflow-hidden bg-[#9DA58B] p-8 text-white sm:min-h-[520px] sm:p-12"
            >
              <div className="absolute -right-20 -top-20 h-[350px] w-[350px] rounded-full border border-white/20 transition-transform duration-700 group-hover:scale-110" />

              <div className="absolute inset-0 bg-gradient-to-br from-[#59634D]/35 to-[#24221F]/45" />

              <div className="relative flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-[0.25em] text-white/75">
                  COLLECTION / 01
                </span>

                <ArrowUpRight
                  size={20}
                  className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </div>

              <div className="relative">
                <p className="mb-4 text-[9px] uppercase tracking-[0.25em] text-white/70">
                  THE MATCHING MOMENT
                </p>

                <h3 className="font-serif text-6xl font-light tracking-[-0.05em] sm:text-8xl">
                  Sets.
                </h3>

                <p className="mt-5 max-w-xs text-xs leading-7 text-white/75">
                  Put together, or styled your own way.
                  Discover the Sets collection.
                </p>

                <span className="mt-8 inline-flex border-b border-white/60 pb-2 text-[9px] uppercase tracking-[0.2em]">
                  Explore Sets
                </span>
              </div>
            </Link>

            <Link
              href="/collections/jackets"
              className="group relative flex min-h-[390px] flex-col justify-between overflow-hidden bg-[#A58F80] p-8 text-white sm:min-h-[520px] sm:p-12"
            >
              <div className="absolute -bottom-32 -left-20 h-[400px] w-[400px] rounded-full border border-white/20 transition-transform duration-700 group-hover:scale-110" />

              <div className="absolute inset-0 bg-gradient-to-br from-[#80695B]/35 to-[#24221F]/45" />

              <div className="relative flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-[0.25em] text-white/75">
                  COLLECTION / 02
                </span>

                <ArrowUpRight
                  size={20}
                  className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </div>

              <div className="relative">
                <p className="mb-4 text-[9px] uppercase tracking-[0.25em] text-white/70">
                  THE FINISHING TOUCH
                </p>

                <h3 className="font-serif text-6xl font-light tracking-[-0.05em] sm:text-8xl">
                  Jackets.
                </h3>

                <p className="mt-5 max-w-xs text-xs leading-7 text-white/75">
                  The layer that changes the whole look.
                  Discover the Jackets collection.
                </p>

                <span className="mt-8 inline-flex border-b border-white/60 pb-2 text-[9px] uppercase tracking-[0.2em]">
                  Explore Jackets
                </span>
              </div>
            </Link>
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              href="/collections/all-pieces"
              className="group inline-flex items-center gap-4 border-b border-[#24221F]/50 pb-3 text-[9px] font-semibold uppercase tracking-[0.2em] transition hover:border-[#89965D]"
            >
              Explore all pieces
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="relative overflow-hidden bg-[#24221F] px-6 py-28 text-center text-[#F5F1EB] sm:px-10 sm:py-36">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full border border-white/10" />

        <div className="pointer-events-none absolute -right-40 -bottom-52 h-[550px] w-[550px] rounded-full border border-white/10" />

        <div className="relative mx-auto max-w-4xl">
          <Sparkles
            size={20}
            className="mx-auto text-[#D8ED83]"
          />

          <p className="mt-8 text-[9px] font-semibold uppercase tracking-[0.35em] text-[#D8ED83]">
            THIS IS YOUR SPACE
          </p>

          <h2 className="mt-8 font-serif text-5xl font-light leading-[1.05] tracking-[-0.05em] sm:text-7xl lg:text-8xl">
            Make it
            <span className="italic text-[#D8ED83]">
              {" "}yours.
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-md text-xs leading-8 text-white/55">
            Your style has its own story.
            We are here for the next chapter.
          </p>

          <Link
            href="/collections/all-pieces"
            className="group mt-10 inline-flex items-center gap-5 bg-[#D8ED83] px-8 py-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#24221F] transition hover:bg-[#F5F1EB]"
          >
            Discover TALA
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

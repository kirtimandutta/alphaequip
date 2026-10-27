"use client";

import { SectionLabel } from "@/components/SectionLabel";
import { useInquiry } from "@/components/providers";
import { inquiryRoles, trustBadges, turnkeyScopes } from "@/lib/data";
import { Building2, Factory, Layers, Wind } from "lucide-react";
import Image from "next/image";

const icons = {
  civil: Building2,
  stack: Factory,
  ash: Layers,
  apcs: Wind,
} as const;

export function Turnkey() {
  const { openInquiry } = useInquiry();

  return (
    <section id="projects" className="tech-grid scroll-mt-24">
      <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-24 md:px-10">
        <div className="max-w-3xl">
          <SectionLabel index="05" label="Turnkey crematoria" />
          <h2 className="mt-4 font-display text-4xl tracking-tight text-white sm:text-5xl">
            The furnace, the hall, the stack, the ash path.
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-300">
            One desk for civil and shed design, a 30 m MS fabricated stack, ash handling and pulverizer, and the air pollution control system.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {turnkeyScopes.map((scope) => {
            const Icon = icons[scope.id as keyof typeof icons];
            return (
              <article
                key={scope.id}
                className="rounded-3xl border border-purple-500/20 bg-black/70 p-6 backdrop-blur-2xl transition-colors hover:border-yellow-400/50"
              >
                <Icon className="text-yellow-400" size={22} />
                <h3 className="mt-5 font-display text-2xl text-white">{scope.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{scope.copy}</p>
              </article>
            );
          })}
        </div>

        <figure className="relative mt-8 overflow-hidden rounded-[2rem] border border-purple-500/20">
          <div className="relative aspect-[669/373] md:aspect-[2.4/1]">
            <Image
              src="/images/wet-scrubber.png"
              alt="Stainless steel air pollution control skid with scrubber vessels, purple process lines, and a fabricated stack"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07070A] via-[#07070A]/55 to-transparent" />
          </div>
          <figcaption className="absolute bottom-0 left-0 max-w-lg p-6 sm:p-10">
            <p className="text-[11px] uppercase tracking-[0.28em] text-purple-300">APCS</p>
            <p className="mt-3 font-display text-3xl text-white sm:text-4xl">
              Wet scrubbing before the stack.
            </p>
          </figcaption>
        </figure>

        <div className="mt-10">
          <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
            Specified for government and institutional buyers across India
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {trustBadges.map((badge) => (
              <li
                key={badge}
                className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-xs uppercase tracking-[0.16em] text-yellow-200"
              >
                {badge}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 rounded-[2rem] border border-purple-500/20 bg-black/70 p-6 backdrop-blur-2xl sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-yellow-400">
                Fast-track tender desk
              </p>
              <h3 className="mt-3 font-display text-3xl text-white sm:text-4xl">
                Municipal commissioners, EPC contractors, crematorium trusts.
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                Open the inquiry drawer with the audience already set. The brief is composed in the browser and handed to the Vadodara desk by email.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {inquiryRoles.slice(0, 3).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => openInquiry({ role, origin: "Turnkey desk" })}
                    className="rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-200 hover:border-yellow-400/50"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => openInquiry({ origin: "Turnkey desk" })}
              className="inline-flex items-center justify-center rounded-full bg-yellow-400 px-6 py-3.5 text-sm font-semibold text-black hover:shadow-[0_0_25px_#FACC15]"
            >
              Open tender inquiry
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

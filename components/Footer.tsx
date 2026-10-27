"use client";

import { company, navItems } from "@/lib/data";
import { useSite } from "@/components/providers";

export function Footer() {
  const { scrollTo } = useSite();

  return (
    <footer className="border-t border-white/10 bg-[#07070A]">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 md:px-10 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl text-white">
            Alpha<span className="text-yellow-400">.</span>
          </p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-400">
            High-temperature cremation furnaces and thermal incineration systems, built in{" "}
            {company.city} since {company.established}.
          </p>
          <div className="mt-6 flex gap-2" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-yellow-400" />
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            <span className="h-2 w-2 rounded-full bg-zinc-700" />
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Navigate</p>
          <ul className="mt-4 space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <button
                  type="button"
                  onClick={() => scrollTo(item.href)}
                  className="text-sm text-zinc-300 hover:text-yellow-400"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">Desk</p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-300">
            <li>{company.city}</li>
            <li>
              <a className="hover:text-yellow-400" href={`tel:${company.phoneTel}`}>
                {company.phoneDisplay}
              </a>
            </li>
            <li>
              <a className="hover:text-yellow-400" href={`mailto:${company.email}`}>
                {company.email}
              </a>
            </li>
            <li>
              <a className="hover:text-yellow-400" href={company.url} rel="noreferrer">
                {company.domain}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-xs text-zinc-500 md:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Alpha Equipments. All rights reserved.</p>
          <p>1400°C · 60–90 min · Dual fuel · Wet scrubber</p>
        </div>
      </div>
    </footer>
  );
}

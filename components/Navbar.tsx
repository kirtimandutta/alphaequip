"use client";

import { company, navItems } from "@/lib/data";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useInquiry, useSite } from "@/components/providers";

export function Navbar() {
  const { scrollTo, lockScroll } = useSite();
  const { openInquiry } = useInquiry();
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const unlock = lockScroll();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      unlock();
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, lockScroll]);

  function go(href: string) {
    setMenuOpen(false);
    scrollTo(href);
    window.history.replaceState(null, "", href);
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        solid || menuOpen ? "border-b border-white/10 bg-black/70 backdrop-blur-2xl" : "bg-transparent"
      }`}
    >
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-yellow-400 focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-5 md:px-10">
        <button type="button" onClick={() => go("#engineering")} className="text-left">
          <span className="block font-display text-lg leading-none tracking-tight text-white">
            Alpha<span className="text-yellow-400">.</span>
          </span>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.28em] text-zinc-400">
            Equipments · {company.city}
          </span>
        </button>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => go(item.href)}
              className="text-[12px] uppercase tracking-[0.18em] text-zinc-300 transition-colors hover:text-yellow-400"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${company.phoneTel}`}
            className="hidden text-xs tracking-wide text-zinc-300 xl:inline"
          >
            {company.phoneDisplay}
          </a>
          <button
            type="button"
            onClick={() => openInquiry({ origin: "Navigation" })}
            className="hidden rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-black hover:shadow-[0_0_25px_#FACC15] sm:inline-flex"
          >
            Request proposal
          </button>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white lg:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav className="border-t border-white/10 px-5 py-4 lg:hidden" aria-label="Mobile">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => go(item.href)}
                className="rounded-xl px-3 py-3 text-left text-lg text-white hover:bg-white/5"
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openInquiry({ origin: "Navigation" });
              }}
              className="mt-3 rounded-full bg-yellow-400 px-4 py-3 text-sm font-semibold text-black"
            >
              Request proposal
            </button>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

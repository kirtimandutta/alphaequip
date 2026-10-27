"use client";

import { FrameCorners } from "@/components/FrameCorners";
import { SectionLabel } from "@/components/SectionLabel";
import { useSite } from "@/components/providers";
import { hotspots, type Hotspot } from "@/lib/data";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export function HotspotInspector() {
  const { lockScroll } = useSite();
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = hotspots.find((spot) => spot.id === activeId) ?? null;

  useEffect(() => {
    if (!active) return;
    const unlock = lockScroll();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      unlock();
      window.removeEventListener("keydown", onKey);
    };
  }, [active, lockScroll]);

  return (
    <section id="chambers" className="tech-grid scroll-mt-24">
      <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-24 md:px-10">
        <div className="max-w-2xl">
          <SectionLabel index="03" label="X-ray refractory" />
          <h2 className="mt-4 font-display text-4xl tracking-tight text-white sm:text-5xl">
            Read the furnace in section.
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-300">
            Four stations on the gas path. Open a pin for the engineering note, the chamber, and the hardware that sits on it.
          </p>
        </div>

        <div className="relative mt-12 overflow-hidden rounded-[2rem] border border-purple-500/20 bg-black/70 backdrop-blur-2xl">
          <FrameCorners />
          <div className="pointer-events-none absolute left-[22%] top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-yellow-400/15 blur-3xl" />
          <div className="pointer-events-none absolute right-[18%] top-[20%] h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="relative mx-auto aspect-[669/373] max-w-5xl">
            <Image
              src="/images/furnace-cutaway.png"
              alt="Interactive cutaway of the Alpha Equipments furnace, with pins on the chamber, re-combustion path, controls, and scrubber ducts"
              fill
              sizes="(min-width: 1024px) 1100px, 100vw"
              className="object-contain"
            />
            {hotspots.map((spot) => {
              const selected = spot.id === activeId;
              const heat = spot.tone === "heat";
              return (
                <button
                  key={spot.id}
                  type="button"
                  aria-pressed={selected}
                  aria-label={`${spot.title}. ${spot.pin}`}
                  onClick={() => setActiveId(selected ? null : spot.id)}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                >
                  <span className="relative grid h-11 w-11 place-items-center">
                    <span
                      className={`absolute inset-0 rounded-full motion-reduce:animate-none ${
                        heat ? "animate-ping bg-yellow-400/40" : "animate-ping bg-purple-500/40"
                      }`}
                    />
                    <span
                      className={`relative h-3.5 w-3.5 rounded-full ${
                        heat ? "bg-yellow-400 shadow-[0_0_16px_#FACC15]" : "bg-purple-400 shadow-[0_0_16px_#A855F7]"
                      }`}
                    />
                  </span>
                  <span
                    className={`absolute top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-full border bg-black/80 px-3 py-1 text-[11px] tracking-wide md:block ${
                      spot.x > 62 ? "right-12" : "left-12"
                    } ${heat ? "border-yellow-400/40 text-yellow-200" : "border-purple-400/40 text-purple-200"}`}
                  >
                    {spot.pin}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {hotspots.map((spot) => {
            const selected = spot.id === activeId;
            return (
              <button
                key={spot.id}
                type="button"
                onClick={() => setActiveId(selected ? null : spot.id)}
                className={`rounded-2xl border bg-black/70 p-4 text-left backdrop-blur-2xl transition-colors hover:border-yellow-400/50 ${
                  selected ? "border-yellow-400/70" : "border-purple-500/20"
                }`}
              >
                <p className="font-mono text-[11px] text-yellow-400">{spot.index}</p>
                <p className="mt-2 font-display text-xl text-white">{spot.title}</p>
                <p className="mt-2 text-sm text-zinc-400">{spot.pin}</p>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {active ? <TechnicalDrawer spot={active} onClose={() => setActiveId(null)} /> : null}
      </AnimatePresence>
    </section>
  );
}

function TechnicalDrawer({ spot, onClose }: { spot: Hotspot; onClose: () => void }) {
  return (
    <>
      <motion.button
        type="button"
        aria-label="Close technical drawer"
        className="fixed inset-0 z-[60] bg-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="hotspot-title"
        data-lenis-prevent
        className="fixed inset-y-0 right-0 z-[70] w-full max-w-xl overflow-y-auto border-l border-purple-500/20 bg-[#07070A]/95 p-6 backdrop-blur-2xl md:p-8"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
      >
        <div className="flex items-start justify-between gap-4">
          <p className="text-[11px] uppercase tracking-[0.28em] text-yellow-400">
            {spot.index} / Engineering note
          </p>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <h3 id="hotspot-title" className="mt-4 font-display text-4xl tracking-tight text-white">
          {spot.title}
        </h3>
        <p className="mt-4 text-sm leading-7 text-zinc-300">{spot.summary}</p>
        <div className="relative mt-6 aspect-[669/373] overflow-hidden rounded-2xl border border-white/10">
          <Image src={spot.image} alt={spot.imageAlt} fill sizes="480px" className="object-cover" />
        </div>
        <ul className="mt-6 space-y-3">
          {spot.points.map((point) => (
            <li key={point} className="flex gap-3 text-sm leading-6 text-zinc-200">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
              {point}
            </li>
          ))}
        </ul>
      </motion.aside>
    </>
  );
}

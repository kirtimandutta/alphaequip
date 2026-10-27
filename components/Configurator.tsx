"use client";

import { CountUp } from "@/components/CountUp";
import { FrameCorners } from "@/components/FrameCorners";
import { SectionLabel } from "@/components/SectionLabel";
import { useInquiry, useMachine } from "@/components/providers";
import { fuelModes } from "@/lib/data";
import { formatIN, formatINR } from "@/lib/format";
import { downloadSpecification } from "@/lib/tds";
import { motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { ArrowRight, FileDown } from "lucide-react";
import Image from "next/image";
import { useState, type KeyboardEvent } from "react";

const views = [
  {
    id: "housing",
    label: "Housing",
    src: "/images/machine-exterior.png",
    alt: "Matte black Alpha Equipments furnace with hydraulic door, loading trolley, and PLC panel",
  },
  {
    id: "xray",
    label: "X-Ray Chamber",
    src: "/images/furnace-cutaway.png",
    alt: "Section through the refractory chambers, burners, and purple combustion-air lines",
  },
  {
    id: "scrubber",
    label: "Scrubber Train",
    src: "/images/wet-scrubber.png",
    alt: "Stainless wet scrubber skid with induced-draft stack and control cabinet",
  },
] as const;

export function Configurator() {
  const reduce = useReducedMotion() ?? false;
  const { fuelId, setFuelId } = useMachine();
  const { openInquiry } = useInquiry();
  const [view, setView] = useState<(typeof views)[number]["id"]>("housing");
  const mode = fuelModes.find((item) => item.id === fuelId) ?? fuelModes[0];
  const photo = views.find((item) => item.id === view) ?? views[0];
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useTransform(pointerX, [-0.5, 0.5], [-7, 7]);
  const rotateX = useTransform(pointerY, [-0.5, 0.5], [5, -5]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = fuelModes.findIndex((item) => item.id === fuelId);
    if (event.key !== "ArrowRight" && event.key !== "ArrowDown" && event.key !== "ArrowLeft" && event.key !== "ArrowUp") {
      return;
    }
    event.preventDefault();
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const next = fuelModes[(index + direction + fuelModes.length) % fuelModes.length];
    setFuelId(next.id);
  }

  return (
    <section id="configurator" className="tech-grid scroll-mt-24 overflow-hidden">
      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1440px] items-center gap-12 px-5 py-24 md:px-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div
          className="relative"
          onMouseMove={(event) => {
            if (reduce) return;
            const bounds = event.currentTarget.getBoundingClientRect();
            pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
            pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
          }}
          onMouseLeave={() => {
            pointerX.set(0);
            pointerY.set(0);
          }}
        >
          <div className="pointer-events-none absolute left-[18%] top-1/3 h-56 w-56 rounded-full bg-yellow-400/20 blur-3xl" />
          <div className="pointer-events-none absolute right-[12%] top-[18%] h-56 w-56 rounded-full bg-purple-500/25 blur-3xl" />
          <motion.div
            style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1200 }}
            className="relative overflow-hidden rounded-[2rem] border border-purple-500/20 bg-black/70 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
          >
            <FrameCorners />
            <div className="relative aspect-[669/373]">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-contain"
              />
            </div>
            <div className="flex items-end justify-between gap-4 border-t border-white/10 px-5 py-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">Inspector</p>
                <p className="mt-1 font-display text-xl text-white">{mode.short}</p>
              </div>
              <p className="font-mono text-sm text-yellow-400">{mode.efficiency} duty</p>
            </div>
          </motion.div>
          <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Machine view">
            {views.map((item) => {
              const selected = item.id === view;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setView(item.id)}
                  className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] ${
                    selected
                      ? "border-yellow-400 bg-yellow-400 text-black"
                      : "border-white/15 bg-black/50 text-zinc-300 hover:border-yellow-400/50"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <SectionLabel index="02" label="Machine configurator" />
          <h2 className="mt-4 font-display text-4xl tracking-tight text-white sm:text-5xl">
            Configure the duty cycle.
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-300">
            Switch the fuel source. Running cost, cycle time, and the timber and carbon kept off an open pyre update with the mode.
          </p>

          <div
            role="radiogroup"
            aria-label="Fuel source"
            className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2"
            onKeyDown={onKeyDown}
          >
            {fuelModes.map((item) => {
              const selected = item.id === fuelId;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setFuelId(item.id)}
                  className={`px-4 py-4 text-left transition-colors ${
                    selected ? "bg-yellow-400 text-black" : "bg-black text-white hover:bg-white/5"
                  }`}
                >
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className={`mt-1 block text-xs leading-5 ${selected ? "text-black/70" : "text-zinc-400"}`}>
                    {item.kicker}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-6 text-sm leading-6 text-zinc-300">{mode.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-3">
            <Stat label="Running cost / cycle" value={mode.costPerCycle} format={(value) => formatINR(value)} />
            <Stat label="Average cycle" value={mode.cycleMins} format={(value) => `${formatIN(value)} min`} />
            <Stat label="Timber saved / cycle" value={mode.timberSavedKg} format={(value) => `${formatIN(value)} kg`} />
            <Stat label="Carbon avoided / cycle" value={mode.carbonSavedKg} format={(value) => `${formatIN(value)} kg`} />
          </dl>
          <dl className="mt-3 grid grid-cols-1 gap-3 text-xs text-zinc-400 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 px-3 py-3">
              <dt className="uppercase tracking-[0.14em]">Power</dt>
              <dd className="mt-2 text-sm text-white">{mode.power}</dd>
            </div>
            <div className="rounded-2xl border border-white/10 px-3 py-3">
              <dt className="uppercase tracking-[0.14em]">Heat-up</dt>
              <dd className="mt-2 text-sm text-white">{mode.heatUp}</dd>
            </div>
            <div className="rounded-2xl border border-white/10 px-3 py-3">
              <dt className="uppercase tracking-[0.14em]">Stack</dt>
              <dd className="mt-2 text-sm text-white">{mode.emissions}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                openInquiry({
                  fuelId: mode.id,
                  origin: "Machine configurator",
                })
              }
              className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-5 py-3.5 text-sm font-semibold text-black hover:shadow-[0_0_25px_#FACC15]"
            >
              Request Turnkey Project Proposal
              <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => downloadSpecification(mode)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-purple-500/50 bg-black/40 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-xl hover:border-purple-300"
            >
              <FileDown size={16} />
              Download Technical Specification Sheet (TDS)
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  format,
}: {
  label: string;
  value: number;
  format: (value: number) => string;
}) {
  return (
    <div className="rounded-2xl border border-purple-500/20 bg-black/70 p-4 backdrop-blur-2xl hover:border-yellow-400/50">
      <dt className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{label}</dt>
      <dd className="mt-2 font-display text-2xl tabular-nums text-white">
        <CountUp value={value} format={format} />
      </dd>
    </div>
  );
}

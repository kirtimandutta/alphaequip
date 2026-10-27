"use client";

import { CountUp } from "@/components/CountUp";
import { SectionLabel } from "@/components/SectionLabel";
import { useMachine, useSite } from "@/components/providers";
import { OPEN_PYRE_WOOD_KG, computeRoi, getFuel } from "@/lib/data";
import { formatIN, formatINR } from "@/lib/format";
import { useMemo, useState } from "react";

export function RoiSimulator() {
  const { scrollTo } = useSite();
  const { fuelId } = useMachine();
  const mode = getFuel(fuelId);
  const [perMonth, setPerMonth] = useState(120);
  const [rupeesPerKg, setRupeesPerKg] = useState(12);
  const result = useMemo(
    () => computeRoi(perMonth, rupeesPerKg, mode),
    [perMonth, rupeesPerKg, mode],
  );
  const saved = result.savings > 0;

  return (
    <section id="savings" className="tech-grid scroll-mt-24">
      <div className="relative z-10 mx-auto grid max-w-[1440px] items-center gap-12 px-5 py-24 md:px-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionLabel index="04" label="Timber savings" />
          <h2 className="mt-4 font-display text-4xl tracking-tight text-white sm:text-5xl">
            What a closed furnace returns to the city.
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-300">
            Set the monthly load and the local timber price. The model compares an open wood pyre with the fuel mode selected in the configurator.
          </p>
          <button
            type="button"
            onClick={() => scrollTo("#configurator")}
            className="mt-6 text-sm text-yellow-400 underline-offset-4 hover:underline"
          >
            Active fuel: {mode.label}
          </button>
          <p className="mt-6 text-sm leading-6 text-zinc-500">
            Open pyre baseline {OPEN_PYRE_WOOD_KG} kg timber per cremation. This mode avoids {mode.timberSavedKg} kg of that and spends {formatINR(mode.costPerCycle)} on energy. One acre here is {formatIN(400)} trees at {formatIN(250)} kg each. Planning figures, not a quotation.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-yellow-400/30 bg-black/70 p-6 backdrop-blur-2xl sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-yellow-400/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-purple-500/15 blur-3xl" />
          <div className="relative">
            <Slider
              label="Cremations Handled Per Month"
              min={10}
              max={300}
              value={perMonth}
              display={perMonth === 300 ? "300+" : formatIN(perMonth)}
              onChange={setPerMonth}
            />
            <Slider
              label="Local Wood / Timber Cost (₹/kg)"
              min={1}
              max={40}
              value={rupeesPerKg}
              display={`₹${formatIN(rupeesPerKg)}`}
              onChange={setRupeesPerKg}
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-3" aria-live="polite">
              <Readout
                kicker="Annual Wood Conserved"
                value={result.woodKg}
                format={(value) => `${formatIN(value)} kg`}
                caption="Timber Saved"
              />
              <Readout
                kicker="Forest Land Preserved"
                value={result.acres}
                format={(value) => `${formatIN(value, 1)}`}
                caption="Acres of Trees"
              />
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                  {saved ? "Annual Operating Savings" : "Annual operating difference"}
                </p>
                <p className={`mt-3 font-display text-3xl tabular-nums ${saved ? "text-yellow-400" : "text-white"}`}>
                  <CountUp value={Math.abs(result.savings)} format={formatINR} />
                </p>
                <p className="mt-2 text-xs text-zinc-400">
                  {saved ? "Saved over Open Pyres" : "Above open-pyre timber cost at this rate"}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Bar label="Open pyre timber" amount={result.openPyreCost} max={Math.max(result.openPyreCost, result.closedCost, 1)} tone="heat" />
              <Bar label="Closed furnace" amount={result.closedCost} max={Math.max(result.openPyreCost, result.closedCost, 1)} tone="sacred" />
            </div>
            <p className="mt-4 font-mono text-[11px] text-zinc-500">
              {formatIN(result.annualCremations)} cycles · open pyre {formatINR(result.openPyreCost)} · furnace energy {formatINR(result.energyCost)}
              {result.residualWoodCost > 0 ? ` · residual wood ${formatINR(result.residualWoodCost)}` : ""}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Slider({
  label,
  min,
  max,
  value,
  display,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  display: string;
  onChange: (value: number) => void;
}) {
  const percent = ((value - min) / (max - min)) * 100;
  return (
    <label className="mb-6 block">
      <span className="flex items-baseline justify-between gap-4">
        <span className="text-sm text-zinc-200">{label}</span>
        <span className="font-mono text-sm text-yellow-400">{display}</span>
      </span>
      <input
        className="thermal-range mt-4"
        style={{ ["--p" as string]: `${percent}%` }}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function Readout({
  kicker,
  value,
  format,
  caption,
}: {
  kicker: string;
  value: number;
  format: (value: number) => string;
  caption: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{kicker}</p>
      <p className="mt-3 font-display text-3xl tabular-nums text-white">
        <CountUp value={value} format={format} />
      </p>
      <p className="mt-2 text-xs text-zinc-400">{caption}</p>
    </div>
  );
}

function Bar({
  label,
  amount,
  max,
  tone,
}: {
  label: string;
  amount: number;
  max: number;
  tone: "heat" | "sacred";
}) {
  const width = Math.max(4, (amount / max) * 100);
  return (
    <div>
      <div className="mb-1 flex justify-between text-[11px] uppercase tracking-[0.14em] text-zinc-400">
        <span>{label}</span>
        <span className="font-mono normal-case tracking-normal text-zinc-300">{formatINR(amount)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10">
        <div
          className={`h-full rounded-full ${tone === "heat" ? "bg-yellow-400" : "bg-purple-500"}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

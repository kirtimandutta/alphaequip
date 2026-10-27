import { marqueeFacts } from "@/lib/data";

function FactRow({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className={`flex shrink-0 items-center ${hidden ? "motion-reduce:hidden" : ""}`} aria-hidden={hidden}>
      {marqueeFacts.map((fact) => (
        <span key={`${hidden ? "b" : "a"}-${fact}`} className="flex items-center">
          <span className="px-6 text-[11px] uppercase tracking-[0.28em] text-zinc-400">{fact}</span>
          <span className="h-1 w-1 rounded-full bg-yellow-400" />
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <section className="overflow-x-clip border-y border-white/10 bg-[#0C0C12]" aria-label="Furnace capabilities">
      <div className="flex w-max animate-marquee py-4 motion-reduce:animate-none">
        <FactRow />
        <FactRow hidden />
      </div>
    </section>
  );
}

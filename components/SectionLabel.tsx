export function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-yellow-400">
      {index} <span className="text-zinc-600">/</span> {label}
    </p>
  );
}

"use client";

import { useInquiry, useMachine, useSite } from "@/components/providers";
import { company, getFuel, inquiryRoles, type InquiryDraft } from "@/lib/data";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

const fieldClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-yellow-400/70";

export function InquiryDrawer() {
  const { open, seed, ticket, closeInquiry } = useInquiry();

  return (
    <AnimatePresence>
      {open ? <DrawerForm key={ticket} seed={seed} onClose={closeInquiry} /> : null}
    </AnimatePresence>
  );
}

function DrawerForm({ seed, onClose }: { seed: InquiryDraft; onClose: () => void }) {
  const { lockScroll } = useSite();
  const { setFuelId } = useMachine();
  const [draft, setDraft] = useState(seed);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const mode = getFuel(draft.fuelId);

  useEffect(() => lockScroll(), [lockScroll]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function update<K extends keyof InquiryDraft>(key: K, value: InquiryDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const next = validate(draft);
    setErrors(next);
    if (Object.keys(next).length) return;
    setSent(true);
  }

  const brief = composeBrief(draft, mode.label);
  const mailto = `mailto:${company.email}?subject=${encodeURIComponent(
    `Turnkey RFQ · ${draft.organization || "Alpha Equipments"} · ${draft.city || company.city}`,
  )}&body=${encodeURIComponent(brief)}`;

  return (
    <>
      <motion.button
        type="button"
        aria-label="Close inquiry drawer"
        className="fixed inset-0 z-[60] bg-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="rfq-title"
        data-lenis-prevent
        className="fixed inset-y-0 right-0 z-[70] w-full max-w-xl overflow-y-auto border-l border-purple-500/20 bg-[#07070A]/95 p-6 backdrop-blur-2xl md:p-8"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
      >
        <div className="flex items-start justify-between gap-4">
          <p className="text-[11px] uppercase tracking-[0.28em] text-yellow-400">Fast-track tender</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15"
          >
            <X size={16} />
          </button>
        </div>
        <h2 id="rfq-title" className="mt-4 font-display text-4xl tracking-tight text-white">
          Project brief
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          {draft.origin}. The desk is {company.city}. This form stays in the browser until you send it.
        </p>

        {sent ? (
          <div className="mt-8">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-yellow-400 text-black">
              <Check size={20} />
            </div>
            <h3 className="mt-4 font-display text-3xl text-white">Brief composed.</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Email opens to {company.email}. You can also call {company.phoneDisplay}.
            </p>
            <textarea
              readOnly
              value={brief}
              className={`${fieldClass} mt-5 min-h-48 font-mono text-xs leading-5`}
            />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <a
                href={mailto}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-yellow-400 px-5 py-3 text-sm font-semibold text-black hover:shadow-[0_0_25px_#FACC15]"
              >
                Email this brief
              </a>
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard.writeText(brief).then(() => setCopied(true)).catch(() => setCopied(false));
                }}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-purple-500/50 px-5 py-3 text-sm font-semibold text-white"
              >
                {copied ? "Copied" : "Copy brief"}
              </button>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={submit} noValidate>
            <Field label="I am a" error={errors.role}>
              <select
                className={fieldClass}
                style={{ colorScheme: "dark" }}
                value={draft.role}
                onChange={(event) => update("role", event.target.value)}
              >
                {inquiryRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Organization" error={errors.organization}>
              <input
                className={fieldClass}
                value={draft.organization}
                onChange={(event) => update("organization", event.target.value)}
                autoComplete="organization"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="City" error={errors.city}>
                <input
                  className={fieldClass}
                  value={draft.city}
                  onChange={(event) => update("city", event.target.value)}
                  autoComplete="address-level2"
                />
              </Field>
              <Field label="Monthly cremations">
                <input
                  className={fieldClass}
                  inputMode="numeric"
                  value={draft.load}
                  onChange={(event) => update("load", event.target.value)}
                />
              </Field>
            </div>
            <Field label="Contact name" error={errors.name}>
              <input
                className={fieldClass}
                value={draft.name}
                onChange={(event) => update("name", event.target.value)}
                autoComplete="name"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Phone" error={errors.phone}>
                <input
                  className={fieldClass}
                  value={draft.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  autoComplete="tel"
                  inputMode="tel"
                />
              </Field>
              <Field label="Email" error={errors.email}>
                <input
                  className={fieldClass}
                  type="email"
                  value={draft.email}
                  onChange={(event) => update("email", event.target.value)}
                  autoComplete="email"
                />
              </Field>
            </div>
            <Field label="Fuel interest">
              <select
                className={fieldClass}
                style={{ colorScheme: "dark" }}
                value={draft.fuelId}
                onChange={(event) => {
                  update("fuelId", event.target.value);
                  setFuelId(event.target.value);
                }}
              >
                {["electric", "cng", "lpg", "bio"].map((id) => (
                  <option key={id} value={id}>
                    {getFuel(id).label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Notes">
              <textarea
                className={`${fieldClass} min-h-28`}
                value={draft.notes}
                onChange={(event) => update("notes", event.target.value)}
                placeholder="Capacity, plot size, stack constraint, tender date"
              />
            </Field>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-yellow-400 px-5 py-3.5 text-sm font-semibold text-black hover:shadow-[0_0_25px_#FACC15]"
            >
              Compose brief for the desk
            </button>
          </form>
        )}
      </motion.aside>
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-xs uppercase tracking-[0.16em] text-zinc-400">
      {label}
      {children}
      {error ? <span className="mt-1 block normal-case tracking-normal text-red-300">{error}</span> : null}
    </label>
  );
}

function validate(draft: InquiryDraft) {
  const errors: Record<string, string> = {};
  if (!draft.role.trim()) errors.role = "Choose a role.";
  if (!draft.organization.trim()) errors.organization = "Add the organization.";
  if (!draft.city.trim()) errors.city = "Add the city.";
  if (!draft.name.trim()) errors.name = "Add a contact name.";
  const digits = draft.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) errors.phone = "Use a 10-digit phone, with country code if needed.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) errors.email = "Add a valid email.";
  return errors;
}

function composeBrief(draft: InquiryDraft, fuelLabel: string) {
  return [
    "Alpha Equipments — Turnkey RFQ",
    `Path: ${draft.origin}`,
    `Role: ${draft.role}`,
    `Organization: ${draft.organization}`,
    `City: ${draft.city}`,
    `Contact: ${draft.name}`,
    `Phone: ${draft.phone}`,
    `Email: ${draft.email}`,
    `Monthly cremations: ${draft.load || "Not specified"}`,
    `Fuel interest: ${fuelLabel}`,
    `Notes: ${draft.notes || "—"}`,
  ].join("\n");
}

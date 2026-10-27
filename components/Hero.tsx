"use client";

import { asset } from "@/lib/assets";
import {
  heroChapters,
  milestoneFromProgress,
  milestones,
} from "@/lib/data";
import { useMachine, useInquiry, useSite } from "@/components/providers";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const badgeTone = {
  heat: "border-yellow-400/80 text-yellow-400",
  sacred: "border-purple-400/80 text-purple-300",
  dual: "border-white/30 text-white",
};

export function Hero() {
  const reduce = useReducedMotion() ?? false;
  const { scrollTo } = useSite();
  const { openInquiry } = useInquiry();
  const { fuelId } = useMachine();
  const trackRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [milestone, setMilestone] = useState(0);
  const [hint, setHint] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);
  const [dock, setDock] = useState({ organization: "", city: "", load: "120" });

  useEffect(() => {
    if (reduce) return;
    const track = trackRef.current;
    if (!track) return;

    const state = { progress: 0 };
    const apply = (progress: number) => {
      const clamped = Math.min(1, Math.max(0, progress));
      progressRef.current = clamped;
      const video = videoRef.current;
      if (video && Number.isFinite(video.duration) && video.duration > 0) {
        const next = clamped * Math.max(video.duration - 0.05, 0);
        if (Math.abs(video.currentTime - next) > 0.03) {
          try {
            video.currentTime = next;
          } catch {
            /* Media is not seekable yet. */
          }
        }
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${clamped})`;
      if (clamped > 0.02) setHint(false);
      const nextMilestone = milestoneFromProgress(clamped);
      setMilestone((current) => (current === nextMilestone ? current : nextMilestone));
    };

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
          invalidateOnRefresh: true,
        },
      });
      timeline.to(state, {
        progress: 1,
        ease: "none",
        duration: 1,
        onUpdate: () => apply(state.progress),
      });
    }, track);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    void document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      context.revert();
    };
  }, [reduce]);

  function warmVideo() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    if (reduce) {
      video.loop = true;
      void video.play().catch(() => undefined);
      return;
    }
    const play = video.play();
    if (!play) return;
    void play
      .then(() => {
        video.pause();
        const duration = video.duration;
        if (Number.isFinite(duration) && duration > 0) {
          video.currentTime = progressRef.current * Math.max(duration - 0.05, 0);
        }
        ScrollTrigger.refresh();
      })
      .catch(() => undefined);
  }

  function jump(progress: number) {
    const track = trackRef.current;
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const span = track.offsetHeight - window.innerHeight;
    scrollTo(top + span * progress, 0);
  }

  const active = milestones[reduce ? 0 : milestone];
  const showDock = reduce || milestone === 3;

  return (
    <section
      id="engineering"
      ref={trackRef}
      className={reduce ? "relative min-h-screen" : "relative h-[350vh]"}
    >
      <div className={`relative overflow-hidden ${reduce ? "min-h-screen" : "sticky top-0 h-screen"}`}>
        {videoFailed ? (
          <Image
            src="/images/furnace-cutaway.png"
            alt="Cutaway of an Alpha Equipments cremation furnace with the refractory chamber at heat"
            fill
            sizes="100vw"
            className="object-cover [will-change:transform]"
          />
        ) : (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover [will-change:transform]"
            style={{ transform: "translateZ(0)" }}
            src={asset("/videos/alpha-furnace-banner.mp4")}
            poster={asset("/images/furnace-cutaway.png")}
            muted
            playsInline
            preload="auto"
            onLoadedData={warmVideo}
            onError={() => setVideoFailed(true)}
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(7,7,10,0.9),transparent_62%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07070A] via-[#07070A]/20 to-[#07070A]/70" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#07070A] to-transparent" />

        {reduce ? null : (
          <div className="absolute left-5 right-5 top-20 z-10 md:left-10 lg:left-16">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              {heroChapters.map((chapter, index) => {
                const current = index === milestone;
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => jump(chapter.at)}
                    aria-current={current ? "step" : undefined}
                    className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em]"
                  >
                    <span className={current ? "text-yellow-400" : "text-zinc-500"}>{chapter.index}</span>
                    <span className={`${current ? "text-white" : "hidden text-zinc-500 sm:inline"}`}>
                      {chapter.label}
                    </span>
                    {index < heroChapters.length - 1 ? (
                      <span className="hidden h-px w-8 bg-white/20 sm:block" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {milestone < 3 && !reduce ? (
          <div className="absolute right-6 top-28 z-10 hidden w-36 text-right xl:block">
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400">{active.readoutLabel}</p>
            <p className="mt-2 font-mono text-2xl text-white">{active.readout}</p>
          </div>
        ) : null}

        <div className="absolute inset-0 z-10 overflow-y-auto px-5 pb-8 pt-24 md:px-10 lg:px-16">
          <div
            className={`flex min-h-full flex-col gap-6 ${showDock ? "justify-center" : "justify-end"} lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:items-end`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={reduce ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <p
                  className={`inline-flex rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.22em] ${badgeTone[active.tone]}`}
                >
                  {active.badge}
                </p>
                <h1
                  className={`mt-4 max-w-3xl font-display leading-[0.95] tracking-tight text-white ${
                    showDock ? "text-4xl sm:text-5xl" : "text-[2.6rem] sm:text-6xl lg:text-7xl"
                  }`}
                >
                  {active.title}
                </h1>
                <p className={`mt-4 max-w-xl text-base leading-7 text-zinc-200 sm:text-lg ${showDock ? "hidden sm:block" : ""}`}>
                  {active.subtitle}
                </p>
                {active.chips.length ? (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {active.chips.map((chip) => (
                      <li
                        key={chip}
                        className="rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-xs text-zinc-100 backdrop-blur-xl"
                      >
                        {chip}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </motion.div>
            </AnimatePresence>

            {showDock ? (
              <motion.aside
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                data-lenis-prevent
                className="max-h-[min(520px,62vh)] overflow-y-auto rounded-3xl border border-purple-500/20 bg-black/70 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-6"
              >
                <div className="mb-5 h-px bg-gradient-to-r from-yellow-400 via-purple-500 to-transparent" />
                <p className="text-[11px] uppercase tracking-[0.28em] text-yellow-400">
                  Municipal / Turnkey RFQ
                </p>
                <h2 className="mt-3 font-display text-3xl leading-none text-white">Dock a project brief.</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-300">
                  Authority, city, and monthly load. The full tender desk opens with this attached.
                </p>
                <form
                  className="mt-5 space-y-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    openInquiry({
                      organization: dock.organization,
                      city: dock.city,
                      load: dock.load,
                      fuelId,
                      origin: "Hero project dock",
                    });
                  }}
                >
                  <label className="block text-xs uppercase tracking-[0.16em] text-zinc-400">
                    Authority / trust
                    <input
                      value={dock.organization}
                      onChange={(event) => setDock((current) => ({ ...current, organization: event.target.value }))}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm normal-case tracking-normal text-white outline-none placeholder:text-zinc-500 focus:border-yellow-400/70"
                      placeholder="Municipal corporation or trust"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-xs uppercase tracking-[0.16em] text-zinc-400">
                      City
                      <input
                        value={dock.city}
                        onChange={(event) => setDock((current) => ({ ...current, city: event.target.value }))}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm normal-case tracking-normal text-white outline-none placeholder:text-zinc-500 focus:border-yellow-400/70"
                        placeholder="City"
                      />
                    </label>
                    <label className="block text-xs uppercase tracking-[0.16em] text-zinc-400">
                      Load / month
                      <input
                        inputMode="numeric"
                        value={dock.load}
                        onChange={(event) => setDock((current) => ({ ...current, load: event.target.value }))}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm normal-case tracking-normal text-white outline-none placeholder:text-zinc-500 focus:border-yellow-400/70"
                      />
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-yellow-400 px-5 py-3 text-sm font-semibold text-black hover:shadow-[0_0_25px_#FACC15]"
                  >
                    Open turnkey RFQ
                    <ArrowRight size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollTo("#configurator")}
                    className="inline-flex w-full items-center justify-center rounded-full border border-purple-500/50 bg-black/40 px-5 py-3 text-sm font-semibold text-white backdrop-blur-xl hover:border-purple-300"
                  >
                    Enter machine customizer
                  </button>
                </form>
              </motion.aside>
            ) : null}
          </div>
        </div>

        {hint && !reduce ? (
          <p className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.32em] text-zinc-300">
            Scroll the furnace
          </p>
        ) : null}
        <div className="absolute inset-x-0 bottom-0 z-10 h-px bg-white/10">
          <div ref={barRef} className="h-full origin-left bg-yellow-400 [will-change:transform]" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </section>
  );
}

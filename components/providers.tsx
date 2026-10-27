"use client";

import {
  emptyDraft,
  getFuel,
  type InquiryDraft,
} from "@/lib/data";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
gsap.registerPlugin(ScrollTrigger);

type SiteContextValue = {
  scrollTo: (target: string | number | HTMLElement, offset?: number) => void;
  lockScroll: () => () => void;
};

type MachineContextValue = {
  fuelId: string;
  setFuelId: (id: string) => void;
};

type InquiryContextValue = {
  open: boolean;
  seed: InquiryDraft;
  ticket: number;
  openInquiry: (partial?: Partial<InquiryDraft>) => void;
  closeInquiry: () => void;
};

const SiteContext = createContext<SiteContextValue | null>(null);
const MachineContext = createContext<MachineContextValue | null>(null);
const InquiryContext = createContext<InquiryContextValue | null>(null);

export function useSite() {
  const value = useContext(SiteContext);
  if (!value) throw new Error("useSite must be used within Providers");
  return value;
}

export function useMachine() {
  const value = useContext(MachineContext);
  if (!value) throw new Error("useMachine must be used within Providers");
  return value;
}

export function useInquiry() {
  const value = useContext(InquiryContext);
  if (!value) throw new Error("useInquiry must be used within Providers");
  return value;
}

function SiteProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const locks = useRef(0);

  const applyLock = useCallback(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (locks.current > 0) lenis.stop();
    else lenis.start();
  }, []);

  const scrollTo = useCallback((target: string | number | HTMLElement, offset = -80) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, { offset });
      return;
    }
    if (typeof target === "string") {
      document.querySelector(target)?.scrollIntoView();
    } else if (typeof target === "number") {
      window.scrollTo({ top: target });
    } else {
      target.scrollIntoView();
    }
  }, []);

  const lockScroll = useCallback(() => {
    locks.current += 1;
    applyLock();
    return () => {
      locks.current = Math.max(0, locks.current - 1);
      applyLock();
    };
  }, [applyLock]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({
      duration: reduce ? 0 : 1.05,
      smoothWheel: !reduce,
      syncTouch: !reduce,
      touchMultiplier: 1.1,
      wheelMultiplier: 0.92,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);
    applyLock();

    const hash = window.location.hash;
    if (hash) {
      window.setTimeout(() => {
        lenis.scrollTo(hash, { offset: -80 });
      }, 350);
    }

    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [applyLock]);

  const value = useMemo(() => ({ scrollTo, lockScroll }), [scrollTo, lockScroll]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

function MachineProvider({ children }: { children: ReactNode }) {
  const [fuelId, setFuelIdState] = useState("electric");
  const setFuelId = useCallback((id: string) => {
    if (getFuel(id).id === id) setFuelIdState(id);
  }, []);
  const value = useMemo(() => ({ fuelId, setFuelId }), [fuelId, setFuelId]);
  return <MachineContext.Provider value={value}>{children}</MachineContext.Provider>;
}

function InquiryProvider({ children }: { children: ReactNode }) {
  const { fuelId } = useMachine();
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState<InquiryDraft>(emptyDraft);
  const [ticket, setTicket] = useState(0);

  const openInquiry = useCallback(
    (partial?: Partial<InquiryDraft>) => {
      setSeed({
        ...emptyDraft,
        fuelId,
        origin: partial?.origin ?? "Turnkey desk",
        ...partial,
      });
      setTicket((value) => value + 1);
      setOpen(true);
    },
    [fuelId],
  );

  const closeInquiry = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, seed, ticket, openInquiry, closeInquiry }),
    [open, seed, ticket, openInquiry, closeInquiry],
  );

  return (
    <InquiryContext.Provider value={value}>{children}</InquiryContext.Provider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SiteProvider>
      <MachineProvider>
        <InquiryProvider>{children}</InquiryProvider>
      </MachineProvider>
    </SiteProvider>
  );
}

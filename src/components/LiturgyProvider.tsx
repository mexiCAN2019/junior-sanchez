"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  canonicalHour,
  describeDay,
  liturgicalYear,
  type LitColor,
  type LiturgicalDay,
  type LiturgicalYear,
} from "@/lib/liturgical";

interface Liturgy {
  /** Null during server rendering — the date belongs to the visitor, not the server. */
  today: LiturgicalDay | null;
  year: LiturgicalYear | null;
  hour: string | null;
  /** A season the visitor is previewing from the calendar strip. */
  preview: LitColor | null;
  setPreview: (color: LitColor | null) => void;
}

const LiturgyContext = createContext<Liturgy | null>(null);

// The snapshot is a string so React can compare it by value; it changes once an hour.
function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(id);
}
function clientSnapshot() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}`;
}
function serverSnapshot() {
  return "";
}

export function LiturgyProvider({ children }: { children: ReactNode }) {
  const key = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const [preview, setPreview] = useState<LitColor | null>(null);

  const value = useMemo<Liturgy>(() => {
    if (!key) return { today: null, year: null, hour: null, preview, setPreview };
    const [y, m, d, h] = key.split("-").map(Number);
    const now = new Date(y, m, d, h);
    return {
      today: describeDay(now),
      year: liturgicalYear(now),
      hour: canonicalHour(now),
      preview,
      setPreview,
    };
  }, [key, preview]);

  // The whole site's --altar accent is driven by this attribute (see globals.css).
  const color = preview ?? value.today?.color;
  useEffect(() => {
    if (color) document.documentElement.dataset.lit = color;
  }, [color]);

  return <LiturgyContext.Provider value={value}>{children}</LiturgyContext.Provider>;
}

export function useLiturgy(): Liturgy {
  const ctx = useContext(LiturgyContext);
  if (!ctx) throw new Error("useLiturgy must be used inside <LiturgyProvider>");
  return ctx;
}

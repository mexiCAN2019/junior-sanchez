"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** The visitor's current year. Prerendering can't know it, so it fills in on the client. */
export function CurrentYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => null,
  );
  return <span>{year}</span>;
}

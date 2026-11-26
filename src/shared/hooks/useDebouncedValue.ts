"use client";
import { useEffect, useState } from "react";

/**
 * value, once it has stopped changing for delayMs. Each change restarts the
 * wait, so a burst of keystrokes yields one update.
 */
export const useDebouncedValue = <T>(value: T, delayMs: number): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
};

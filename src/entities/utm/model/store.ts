"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { UtmData } from "./types";

/* The UTM store's state and actions. */
type UtmStore = {
  utmData: UtmData | null;
  setUtmData: (utmData: UtmData) => void;
  clearUtmData: () => void;
  hasUtmData: () => boolean;
};

/**
 * The first-touch UTM params in localStorage, until an order carries them to
 * KeyCRM.
 */
export const useUtmStore = create<UtmStore>()(
  persist(
    (set, get) => ({
      utmData: null,

      setUtmData: (utmData) => set({ utmData }),

      clearUtmData: () => set({ utmData: null }),

      hasUtmData: () => {
        const { utmData } = get();
        return utmData !== null && Object.keys(utmData).length > 0;
      },
    }),
    {
      name: "glimmer-utm-storage",
    }
  )
);

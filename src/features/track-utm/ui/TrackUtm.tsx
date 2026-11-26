"use client";
import { useEffect } from "react";
import { useUtmStore } from "@/entities/utm/model/store";
import { parseUtmParams } from "@/shared/lib/searchParams/utmParams";

/**
 * Stores the UTM params of the landing URL, first touch only: once a
 * campaign is stored, later pages never overwrite it. Renders nothing.
 */
export default function TrackUtm() {
  const { setUtmData, utmData } = useUtmStore();

  useEffect(() => {
    if (utmData) return;

    const parsed = parseUtmParams(new URLSearchParams(window.location.search));
    if (parsed) setUtmData(parsed);
  }, [setUtmData, utmData]);

  return null;
}

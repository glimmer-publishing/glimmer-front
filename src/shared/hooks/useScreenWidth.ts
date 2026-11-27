"use client";
import { useState, useEffect } from "react";

/* Tailwind's md and lg breakpoints, in px: where tablet and desktop start. */
export const TABLET_MIN_WIDTH = 768;
export const DESKTOP_MIN_WIDTH = 1024;

/**
 * The window's inner width, updated on resize, and which of the site's
 * three layouts it falls in: mobile (< 768), tablet (768–1023) or desktop
 * (≥ 1024). The three flags are exclusive. Until mounted the width is 0, so
 * the first render, like the server's, is mobile.
 */
export function useScreenWidth() {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    width,
    isMobile: width < TABLET_MIN_WIDTH,
    isTablet: width >= TABLET_MIN_WIDTH && width < DESKTOP_MIN_WIDTH,
    isDesktop: width >= DESKTOP_MIN_WIDTH,
  };
}

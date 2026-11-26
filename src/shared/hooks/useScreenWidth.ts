"use client";
import { useState, useEffect } from "react";

/* The window's inner width, updated on resize; 0 until mounted. */
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

  return width;
}

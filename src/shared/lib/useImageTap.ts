"use client";

import { useRef } from "react";

/* A pointer that travelled further than this was a swipe, not a tap. Exported
   because the viewer's own backdrop-close uses the same judgement - one number
   so the two cannot drift apart when it is tuned. */
export const TAP_TOLERANCE_PX = 10;

/**
 * Distinguishes a genuine tap on a gallery image from the end of a horizontal
 * swipe, and ignores taps that landed on the navigation arrows. Needed because
 * `react-image-gallery` still emits a click after a drag, which would otherwise
 * open the viewer every time the user swipes between photos on a phone.
 */
export function useImageTap(onTap: () => void) {
  const pointerDownRef = useRef<{ x: number; y: number } | null>(null);

  const onPointerDown = (event: React.PointerEvent) => {
    pointerDownRef.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: React.PointerEvent) => {
    const pointerDown = pointerDownRef.current;
    pointerDownRef.current = null;

    if (!pointerDown) return;

    const travelled = Math.hypot(
      event.clientX - pointerDown.x,
      event.clientY - pointerDown.y,
    );

    if (travelled > TAP_TOLERANCE_PX) return;

    const target = event.target as HTMLElement;
    /* Only the large slide opens the viewer - not the arrows, not the
       thumbnail strip, which keeps its own "switch the slide" behaviour. */
    if (!target.closest(".image-gallery-slide")) return;
    if (target.closest("button")) return;

    onTap();
  };

  return { onPointerDown, onPointerUp };
}

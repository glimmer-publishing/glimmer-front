"use client";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/* Longest a navigation may run before the bar gives up and finishes. */
const MAX_DURATION_MS = 10_000;

/* How often the bar creeps forward while the next page is loading. */
const TRICKLE_INTERVAL_MS = 300;

/* How long the full bar stays before fading, and how long the fade takes. */
const FINISH_HOLD_MS = 200;
const FADE_MS = 300;

/**
 * Whether this click is one Next's Link turns into a client-side navigation
 * to another page of the site: a plain left click on a same-origin link,
 * not opening a new tab, not a download, and not just a hash change.
 */
function isPageNavigation(event: MouseEvent, anchor: HTMLAnchorElement) {
  if (event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return false;
  }
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;

  const url = new URL(anchor.href);
  const current = window.location;
  if (url.origin !== current.origin) return false;

  return url.pathname !== current.pathname || url.search !== current.search;
}

/**
 * The bar itself. Starts on a link click or back/forward, creeps towards 90%
 * while the next page loads, and fills and fades once the route changes.
 */
function TopLoaderBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;

  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const isLoading = useRef(false);
  const renderedRoute = useRef(routeKey);
  const trickle = useRef<number | undefined>(undefined);
  const timeouts = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    window.clearInterval(trickle.current);
    timeouts.current.forEach((id) => window.clearTimeout(id));
    timeouts.current = [];
  }, []);

  const finish = useCallback(() => {
    if (!isLoading.current) return;
    isLoading.current = false;
    clearTimers();
    setProgress(1);
    timeouts.current.push(
      window.setTimeout(() => setIsVisible(false), FINISH_HOLD_MS),
      window.setTimeout(() => setProgress(0), FINISH_HOLD_MS + FADE_MS),
    );
  }, [clearTimers]);

  const start = useCallback(() => {
    if (isLoading.current) return;
    isLoading.current = true;
    clearTimers();
    setIsVisible(true);
    setProgress(0.1);
    trickle.current = window.setInterval(
      () => setProgress((value) => value + (0.9 - value) * 0.1),
      TRICKLE_INTERVAL_MS,
    );
    timeouts.current.push(window.setTimeout(finish, MAX_DURATION_MS));
  }, [clearTimers, finish]);

  /* The new page has rendered. */
  useEffect(() => {
    renderedRoute.current = routeKey;
    finish();
  }, [routeKey, finish]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (isPageNavigation(event, anchor)) start();
    };

    /* Back/forward: by now the URL has changed but the page has not. */
    const onPopState = () => {
      const { pathname: path, search } = window.location;
      const nextRoute = `${path}?${new URLSearchParams(search).toString()}`;
      if (nextRoute !== renderedRoute.current) start();
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      clearTimers();
    };
  }, [start, clearTimers]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[100] h-[3px] w-full origin-left bg-main transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none"
      style={{ transform: `scaleX(${progress})`, opacity: isVisible ? 1 : 0 }}
    />
  );
}

/**
 * A thin progress line at the top of the page while navigating between
 * pages, in the site's main colour. Renders nothing until a navigation starts.
 * The Suspense boundary keeps useSearchParams from opting pages out of static
 * rendering.
 */
export default function TopLoader() {
  return (
    <Suspense fallback={null}>
      <TopLoaderBar />
    </Suspense>
  );
}

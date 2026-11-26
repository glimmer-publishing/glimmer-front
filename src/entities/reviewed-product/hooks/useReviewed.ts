"use client";
import { useEffect } from "react";
import { hydrateReviewed, useReviewedStore } from "../model/store";

/**
 * The viewed books' slugs, most recent first, read from localStorage on
 * mount. hydrated stays false until then.
 */
export const useReviewedSlugs = () => {
  const hydrated = useReviewedStore((state) => state.hydrated);
  const slugs = useReviewedStore((state) => state.slugs);

  useEffect(hydrateReviewed, []);

  return { hydrated, slugs };
};

/* Records a viewed book once its page is shown. */
export const useMarkReviewed = (slug: string) => {
  const addReviewed = useReviewedStore((state) => state.addReviewed);

  useEffect(() => {
    hydrateReviewed();
    addReviewed(slug);
  }, [slug, addReviewed]);
};

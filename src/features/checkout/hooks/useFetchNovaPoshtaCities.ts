"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { fetchNovaPoshtaCities } from "../api/novaPoshta";
import {
  CITY_SEARCH_DEBOUNCE_MS,
  CITY_SEARCH_MIN_LENGTH,
  NOVA_POSHTA_STALE_TIME_MS,
} from "../model/constants";
import type { CheckoutLocationOption } from "../model/types";

/**
 * Nova Poshta cities matching what the customer typed, as dropdown options.
 * The previous matches stay on screen while the next search runs; a
 * response for an older query is dropped by TanStack Query.
 */
export const useFetchNovaPoshtaCities = (query: string) => {
  const term = query.trim();
  const debouncedTerm = useDebouncedValue(term, CITY_SEARCH_DEBOUNCE_MS);
  const isLongEnough = term.length >= CITY_SEARCH_MIN_LENGTH;

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ["nova-poshta-cities", debouncedTerm],
    queryFn: ({ signal }) => fetchNovaPoshtaCities(debouncedTerm, signal),
    enabled: debouncedTerm.length >= CITY_SEARCH_MIN_LENGTH,
    placeholderData: keepPreviousData,
    staleTime: NOVA_POSHTA_STALE_TIME_MS,
  });

  const isSettled = term === debouncedTerm && !isFetching;
  const options: CheckoutLocationOption[] = isLongEnough
    ? (data ?? []).map((city) => ({
        key: city.Ref,
        description: city.Description,
      }))
    : [];

  return {
    options,
    /* True from the keystroke until its search has answered. */
    isLoading: isLongEnough && !isSettled,
    /* True once a search for the current text has answered. */
    hasResult: isLongEnough && isSettled && isSuccess,
    isLongEnough,
  };
};

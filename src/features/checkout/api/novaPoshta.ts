"use client";
import type {
  NovaPoshtaCity,
  NovaPoshtaWarehouse,
} from "@/shared/api/nova-poshta/types";
import { fetchJson } from "@/shared/api/http/fetchJson";

/**
 * Nova Poshta lookups through our own routes, so the API key stays on the
 * server. A failed lookup resolves to an empty list: the customer sees
 * "nothing found" rather than an error. A cancelled one still rejects, so
 * TanStack Query can drop it.
 */
const fetchList = async <T>(url: string, signal?: AbortSignal) => {
  try {
    return await fetchJson<T[]>(url, signal);
  } catch (error) {
    if (signal?.aborted) throw error;
    console.error("Nova Poshta lookup failed:", error);
    return [];
  }
};

/* Cities whose name starts with query (GET /api/nova-poshta/cities). */
export const fetchNovaPoshtaCities = (query: string, signal?: AbortSignal) =>
  fetchList<NovaPoshtaCity>(
    `/api/nova-poshta/cities?${new URLSearchParams({ q: query })}`,
    signal
  );

/* Every branch and parcel locker of one city, by its Nova Poshta Ref. */
export const fetchNovaPoshtaWarehouses = (
  cityRef: string,
  signal?: AbortSignal
) =>
  fetchList<NovaPoshtaWarehouse>(
    `/api/nova-poshta/warehouses?${new URLSearchParams({ cityRef })}`,
    signal
  );

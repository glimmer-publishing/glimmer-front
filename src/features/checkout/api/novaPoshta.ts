"use client";
import type {
  NovaPoshtaCity,
  NovaPoshtaWarehouse,
} from "@/shared/api/nova-poshta/types";

/**
 * Nova Poshta lookups through our own routes, so the API key stays on the
 * server. Failures resolve to an empty list, as before.
 */

const getList = async <T>(url: string): Promise<T[]> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Status ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Nova Poshta lookup failed:", error);
    return [];
  }
};

export const searchCities = (query: string) =>
  getList<NovaPoshtaCity>(
    `/api/nova-poshta/cities?${new URLSearchParams({ q: query })}`
  );

export const getWarehouses = (cityRef: string) =>
  getList<NovaPoshtaWarehouse>(
    `/api/nova-poshta/warehouses?${new URLSearchParams({ cityRef })}`
  );

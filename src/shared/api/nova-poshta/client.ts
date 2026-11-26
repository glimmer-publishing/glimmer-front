import "server-only";
import { NOVA_POSHTA_API_URL } from "@/shared/config/constants";
import { serverEnv } from "@/shared/config/serverEnv";
import type { NovaPoshtaCity, NovaPoshtaWarehouse } from "./types";

/**
 * Nova Poshta lookups, made on the server so the API key (serverEnv) never
 * reaches the browser.
 */

/* How many matches to ask for; the results are then narrowed by prefix. */
const CITY_SEARCH_LIMIT = 50;

/* One Nova Poshta API method; its data list, or [] when there is none. */
const call = async <T>(
  modelName: string,
  calledMethod: string,
  methodProperties: Record<string, string>
): Promise<T[]> => {
  const response = await fetch(NOVA_POSHTA_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey: serverEnv.novaPoshtaApiKey,
      modelName,
      calledMethod,
      methodProperties,
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Nova Poshta: ${response.status}`);

  const { data } = await response.json();
  return Array.isArray(data) ? data : [];
};

/**
 * Cities whose name, without the "(region)" suffix, starts with the query.
 */
export const searchNovaPoshtaCities = async (
  query: string
): Promise<NovaPoshtaCity[]> => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const cities = await call<NovaPoshtaCity>("Address", "getCities", {
    FindByString: query.trim(),
    Limit: String(CITY_SEARCH_LIMIT),
    Page: "1",
  });

  return cities
    .filter((city) =>
      city.Description.split("(")[0].trim().toLowerCase().startsWith(normalized)
    )
    .map(({ Description, Ref }) => ({ Description, Ref }));
};

/* Every branch and parcel locker of one city, by its Ref. */
export const getNovaPoshtaWarehouses = async (
  cityRef: string
): Promise<NovaPoshtaWarehouse[]> =>
  (
    await call<NovaPoshtaWarehouse>("AddressGeneral", "getWarehouses", {
      CityRef: cityRef,
    })
  ).map(({ Description, Ref, CategoryOfWarehouse }) => ({
    Description,
    Ref,
    CategoryOfWarehouse,
  }));

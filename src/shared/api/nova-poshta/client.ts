import "server-only";
import { NOVA_POSHTA_API_URL } from "@/constants/constants";
import type { NovaPoshtaCity, NovaPoshtaWarehouse } from "./types";

/**
 * Nova Poshta lookups, made on the server so the API key never reaches the
 * browser. NEXT_PUBLIC_NOVA_POSHTA_API_KEY is read only as a fallback until
 * NOVA_POSHTA_API_KEY is set everywhere; read here, it is not bundled.
 */
const apiKey = () =>
  process.env.NOVA_POSHTA_API_KEY ||
  process.env.NEXT_PUBLIC_NOVA_POSHTA_API_KEY ||
  "";

/* How many matches to ask for; the results are then narrowed by prefix. */
const CITY_SEARCH_LIMIT = 50;

const call = async <T>(
  modelName: string,
  calledMethod: string,
  methodProperties: Record<string, string>
): Promise<T[]> => {
  const response = await fetch(NOVA_POSHTA_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey: apiKey(),
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

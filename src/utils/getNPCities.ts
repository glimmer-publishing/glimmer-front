import axios from "axios";
import { NOVA_POSHTA_API_URL } from "@/constants/constants";
import { City } from "@/types/city";

/* How many matches to ask Nova Poshta for. Generous, because the results are
   then narrowed to names that start with the query. */
const CITY_SEARCH_LIMIT = 50;

/* Cities matching what the customer typed, searched by Nova Poshta from the
   browser (the same public key the branch lookup uses). Replaces embedding
   all ~11K cities in the checkout page. Matching stays as before: the city
   name, without the "(region)" suffix, starts with the query. */
export async function searchNPCities(query: string): Promise<City[]> {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return [];

  try {
    const { data } = await axios.post(NOVA_POSHTA_API_URL, {
      apiKey: process.env.NEXT_PUBLIC_NOVA_POSHTA_API_KEY,
      modelName: "Address",
      calledMethod: "getCities",
      methodProperties: {
        FindByString: query.trim(),
        Limit: String(CITY_SEARCH_LIMIT),
        Page: "1",
      },
    });

    const cities: City[] = data?.data || [];

    return cities
      .filter((city) =>
        city.Description.split("(")[0]
          .trim()
          .toLowerCase()
          .startsWith(normalizedQuery)
      )
      .map(({ Description, Ref }) => ({ Description, Ref }));
  } catch (error) {
    console.error("Error searching cities:", error);
    return [];
  }
}

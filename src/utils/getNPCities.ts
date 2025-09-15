import axios from "axios";
import { NOVA_POSHTA_API_URL } from "@/constants/constants";

export async function getNPCities() {
  try {
    const { data } = await axios.post(NOVA_POSHTA_API_URL, {
      apiKey: process.env.NEXT_PUBLIC_NOVA_POSHTA_API_KEY,
      modelName: "Address",
      calledMethod: "getCities",
    });
    return data.data || [];
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
}

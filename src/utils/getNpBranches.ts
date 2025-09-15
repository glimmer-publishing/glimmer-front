import axios from "axios";
import { NOVA_POSHTA_API_URL } from "@/constants/constants";

const API_KEY = process.env.NEXT_PUBLIC_NOVA_POSHTA_API_KEY || "";

interface NPBranch {
  Description: string;
  Ref: string;
  CategoryOfWarehouse: string;
}

export async function getNPBranches(cityRef: string): Promise<NPBranch[]> {
  try {
    const { data } = await axios.post(NOVA_POSHTA_API_URL, {
      apiKey: API_KEY,
      modelName: "AddressGeneral",
      calledMethod: "getWarehouses",
      methodProperties: {
        CityRef: cityRef,
      },
    });

    return data.data || [];
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    return [];
  }
}

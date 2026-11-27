"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchNovaPoshtaWarehouses } from "../api/novaPoshta";
import { NOVA_POSHTA_STALE_TIME_MS } from "../model/constants";

/**
 * The branches and parcel lockers of the picked city. Nothing is loaded
 * while no city is picked (cityRef null).
 */
export const useFetchNovaPoshtaWarehouses = (cityRef: string | null) => {
  const { data = [], isFetching } = useQuery({
    queryKey: ["nova-poshta-warehouses", cityRef],
    queryFn: ({ signal }) => fetchNovaPoshtaWarehouses(cityRef!, signal),
    enabled: !!cityRef,
    staleTime: NOVA_POSHTA_STALE_TIME_MS,
  });

  return { warehouses: cityRef ? data : [], isLoading: isFetching };
};

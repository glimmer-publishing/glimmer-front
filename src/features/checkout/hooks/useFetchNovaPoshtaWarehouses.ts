"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchNovaPoshtaWarehouses } from "../api/novaPoshta";

/**
 * The branches and parcel lockers of the picked city. Nothing is loaded
 * while no city is picked (cityRef null).
 */
export const useFetchNovaPoshtaWarehouses = (cityRef: string | null) => {
  const { data = [], isFetching } = useQuery({
    queryKey: ["nova-poshta-warehouses", cityRef],
    queryFn: ({ signal }) => fetchNovaPoshtaWarehouses(cityRef!, signal),
    enabled: !!cityRef,
    staleTime: 5 * 60_000,
  });

  return { warehouses: cityRef ? data : [], isLoading: isFetching };
};

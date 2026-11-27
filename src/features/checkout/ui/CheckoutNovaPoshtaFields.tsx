"use client";
import { useEffect, useMemo, useState } from "react";
import { useFormikContext } from "formik";
import { DeliveryType } from "@/shared/config/enums";
import FormInput from "@/shared/ui/form/FormInput";
import { useFetchNovaPoshtaCities } from "../hooks/useFetchNovaPoshtaCities";
import { useFetchNovaPoshtaWarehouses } from "../hooks/useFetchNovaPoshtaWarehouses";
import { CITY_SEARCH_MIN_LENGTH } from "../model/constants";
import type { CheckoutValues } from "../model/schema";
import CheckoutLocationInput from "./CheckoutLocationInput";

/* A city picked from the dropdown, with the Ref its branches load by. */
type PickedCity = {
  description: string;
  ref: string;
};

/**
 * Nova Poshta's city, then its branch or parcel locker, both picked from
 * lookups made through our server; a courier delivery takes a free-text
 * address instead of the branch. Mounted only while Nova Poshta is the
 * service, so switching away and back starts from scratch.
 */
export default function CheckoutNovaPoshtaFields() {
  const { values, errors, touched, setFieldValue } =
    useFormikContext<CheckoutValues>();

  const [cityQuery, setCityQuery] = useState("");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  /**
   * Only a picked city counts: CheckoutLocationInput clears unpicked text on
   * blur, and editing the text un-picks it.
   */
  const [pickedCity, setPickedCity] = useState<PickedCity | null>(null);
  const cityRef =
    pickedCity && pickedCity.description === values.city
      ? pickedCity.ref
      : null;

  const [warehouseQuery, setWarehouseQuery] = useState("");
  const [isWarehouseDropdownOpen, setIsWarehouseDropdownOpen] = useState(false);

  const cities = useFetchNovaPoshtaCities(cityQuery);
  const { warehouses, isLoading: isLoadingWarehouses } =
    useFetchNovaPoshtaWarehouses(cityRef);

  /* Branches whose name contains what the customer typed. */
  const warehouseOptions = useMemo(() => {
    const term = warehouseQuery.trim().toLowerCase();
    if (!term) return [];

    return warehouses
      .filter((w) => w.Description.toLowerCase().includes(term))
      .map((w) => ({ key: w.Ref, description: w.Description }));
  }, [warehouses, warehouseQuery]);

  /* A different city (or none) makes the chosen branch meaningless. */
  useEffect(() => {
    setFieldValue("branchNumber", "");
    setWarehouseQuery("");
    setIsWarehouseDropdownOpen(false);
  }, [cityRef, setFieldValue]);

  return (
    <>
      <CheckoutLocationInput
        fieldName="city"
        placeholder="Назва населеного пункту"
        options={cities.options}
        isLoading={cities.isLoading}
        emptyMessage={cities.hasResult ? "Нічого не знайдено" : undefined}
        isDropDownOpen={isCityDropdownOpen}
        setIsDropDownOpen={setIsCityDropdownOpen}
        onChange={(e) => {
          setCityQuery(e.target.value);
          setIsCityDropdownOpen(
            e.target.value.trim().length >= CITY_SEARCH_MIN_LENGTH
          );
        }}
        onSelect={(city) => {
          setPickedCity({ description: city.description, ref: city.key });
          setIsCityDropdownOpen(false);
        }}
      />

      {values.deliveryType === DeliveryType.COURIER ? (
        <FormInput
          fieldName="address"
          placeholder="Адреса"
          isRequired
          errors={errors}
          touched={touched}
        />
      ) : (
        <CheckoutLocationInput
          fieldName="branchNumber"
          placeholder={
            values.deliveryType === DeliveryType.BRANCH
              ? "Номер відділення"
              : "Номер поштомату"
          }
          options={warehouseOptions}
          isLoading={isLoadingWarehouses}
          isDropDownOpen={isWarehouseDropdownOpen}
          setIsDropDownOpen={setIsWarehouseDropdownOpen}
          onChange={(e) => {
            setWarehouseQuery(e.target.value);
            setIsWarehouseDropdownOpen(!!e.target.value.trim());
          }}
          onSelect={() => setIsWarehouseDropdownOpen(false)}
        />
      )}
    </>
  );
}

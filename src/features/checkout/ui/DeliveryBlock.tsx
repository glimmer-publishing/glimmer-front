"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useFormikContext, ErrorMessage } from "formik";
import { DeliveryService, DeliveryType } from "@/constants/enums";
import type { NovaPoshtaWarehouse } from "@/shared/api/nova-poshta/types";
import CustomizedInput from "@/shared/ui/form/CustomizedInput";
import RadioButtonInput from "@/shared/ui/form/RadioButtonInput";
import { getWarehouses, searchCities } from "../api/novaPoshta";
import LocationInput, { type LocationOption } from "./LocationInput";

/**
 * Nova Poshta is searched once the customer has typed this many characters,
 * and this long after they stop typing.
 */
const CITY_SEARCH_MIN_LENGTH = 2;
const CITY_SEARCH_DEBOUNCE_MS = 300;

interface Values {
  [fieldName: string]: string;
}

const deliveryServices = [
  {
    label: DeliveryService.NOVA_POSHTA,
    logo: "/images/deliveryPage/deliveryConditions/novaPost.svg",
  },
  {
    label: DeliveryService.UKRPOSHTA,
    logo: "/images/deliveryPage/deliveryConditions/ukrPost.svg",
  },
];

const deliveryTypes = Object.values(DeliveryType);

/**
 * Delivery service, type, city and branch or address. Nova Poshta cities and
 * branches are looked up through the server; Укрпошта takes free text.
 */
export default function DeliveryBlock() {
  const [isCitiesDropDownOpen, setIsCitiesDropDownOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState<LocationOption[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [hasCitySearchResult, setHasCitySearchResult] = useState(false);
  /**
   * The city picked from the dropdown, with the Ref its branches are loaded
   * by. Only a picked city counts: LocationInput clears unpicked text on blur.
   */
  const [selectedCity, setSelectedCity] = useState<{
    description: string;
    ref: string;
  } | null>(null);
  const citySearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Increments per search; a response for an older search is ignored.
  const citySearchId = useRef(0);
  const [warehouses, setWarehouses] = useState<NovaPoshtaWarehouse[]>([]);
  const [isLoadingWarehouses, setIsLoadingWarehouses] = useState(false);
  const [filteredWarehouses, setFilteredWarehouses] = useState<
    LocationOption[]
  >([]);
  const [isWarehousesDropDownOpen, setIsWarehousesDropDownOpen] =
    useState(false);

  const { values, setFieldValue, errors, touched, handleChange } =
    useFormikContext<Values>();

  useEffect(() => {
    setFieldValue("deliveryType", DeliveryType.BRANCH);
  }, [setFieldValue]);

  useEffect(() => {
    if (!values.city) {
      setFilteredWarehouses([]);
      setIsWarehousesDropDownOpen(false);
      setFieldValue("branchNumber", "");
      setWarehouses([]);

      return;
    }

    // Відділення вантажимо лише для міста, обраного зі списку
    if (!selectedCity || selectedCity.description !== values.city) return;

    setIsLoadingWarehouses(true);

    getWarehouses(selectedCity.ref)
      .then((data) => setWarehouses(data))
      .finally(() => setIsLoadingWarehouses(false));

    // очищаємо старе відділення
    setFieldValue("branchNumber", "");
    setFilteredWarehouses([]);
    setIsWarehousesDropDownOpen(false);
  }, [values.city, selectedCity, setFieldValue]);

  const cancelCitySearch = () => {
    if (citySearchTimer.current) clearTimeout(citySearchTimer.current);
    citySearchTimer.current = null;
    citySearchId.current += 1;
    setIsLoadingCities(false);
  };

  useEffect(
    () => () => {
      if (citySearchTimer.current) clearTimeout(citySearchTimer.current);
    },
    []
  );

  useEffect(() => {
    if (!values.deliveryService) return;

    // Скидаємо значення інпутів у Formik
    setFieldValue("city", "");
    setFieldValue("branchNumber", "");
    setFieldValue("address", "");

    // Скидаємо локальні стейти
    cancelCitySearch();
    setSelectedCity(null);
    setHasCitySearchResult(false);
    setWarehouses([]);
    setFilteredCities([]);
    setFilteredWarehouses([]);
    setIsCitiesDropDownOpen(false);
    setIsWarehousesDropDownOpen(false);
  }, [values.deliveryService, setFieldValue]);

  const onCitiesLocationInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleChange(e);
    const inputValue = e.target.value.trim();

    cancelCitySearch();
    setHasCitySearchResult(false);

    if (inputValue.length < CITY_SEARCH_MIN_LENGTH) {
      setFilteredCities([]);
      setIsCitiesDropDownOpen(false);
      return;
    }

    const searchId = citySearchId.current;
    setIsLoadingCities(true);
    setIsCitiesDropDownOpen(true);

    citySearchTimer.current = setTimeout(() => {
      searchCities(inputValue).then((cities) => {
        if (searchId !== citySearchId.current) return;

        setFilteredCities(
          cities.map((city) => ({
            key: city.Ref,
            description: city.Description,
          }))
        );
        setHasCitySearchResult(true);
        setIsLoadingCities(false);
      });
    }, CITY_SEARCH_DEBOUNCE_MS);
  };

  const onWarehousesInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    const inputValue = e.target.value.trim().toLowerCase();

    if (inputValue.length > 0) {
      const filtered = warehouses
        .filter((w) => w.Description.toLowerCase().includes(inputValue))
        .map((w) => ({
          key: w.Ref,
          description: w.Description,
        }));

      setFilteredWarehouses(filtered);
      setIsWarehousesDropDownOpen(true);
    } else {
      setFilteredWarehouses([]);
      setIsWarehousesDropDownOpen(false);
    }
  };

  const isDeliveryChecked = !!values.deliveryService;

  return (
    <>
      {/* Служби доставки */}
      <div className="relative">
        <div className="flex gap-4 lg:gap-8">
          {deliveryServices.map((service) => (
            <button
              type="button"
              key={service.label}
              onClick={() => setFieldValue("deliveryService", service.label)}
              className={`cursor-pointer flex items-center gap-2 w-1/2 h-12 rounded-[12px] p-3 justify-center shadow-sm ${
                values.deliveryService === service.label
                  ? "bg-main"
                  : "bg-white"
              } transition duration-300 ease-in-out`}
            >
              <Image
                src={service.logo}
                alt={service.label}
                width={92}
                height={36}
                className="w-auto h-6 object-contain"
              />
              <span className="text-[14px] lg:text-[18px] font-medium leading-[120%]">
                {service.label}
              </span>
            </button>
          ))}
        </div>
        <ErrorMessage
          name={"deliveryService"}
          component="p"
          className="absolute bottom-[-11px] left-2 text-[9px] font-normal leading-none text-red-500"
        />
      </div>

      <div
        className={`pb-3 transition-[max-height] duration-500 ${
          isDeliveryChecked ? "max-h-[500px] ease-in" : "max-h-0 ease-out"
        }`}
      >
        {/* Тип доставки */}
        <div className="flex flex-col gap-4 my-6">
          {deliveryTypes.map((type) => (
            <RadioButtonInput
              key={type}
              fieldName="deliveryType"
              value={type}
              onClick={() => setFieldValue("deliveryType", type)}
              label={type}
            />
          ))}
        </div>
        {values.deliveryService === DeliveryService.UKRPOSHTA ? (
          values.deliveryType !== DeliveryType.COURIER ? (
            <p className="mb-6 text-[14px] lg:text-[15px] font-medium leading-[120%]">
              Обери <span className="lowercase">{values.deliveryType}</span>{" "}
              Укрпошти
            </p>
          ) : (
            <p className="mb-6 text-[14px] lg:text-[15px] font-medium leading-[120%]">
              Введи адресу доставки
            </p>
          )
        ) : values.deliveryType !== DeliveryType.COURIER ? (
          <p className="mb-6 text-[14px] lg:text-[15px] font-medium leading-[120%]">
            Обери <span className="lowercase">{values.deliveryType}</span> Нової
            пошти
          </p>
        ) : (
          <p className="mb-6 text-[14px] lg:text-[15px] font-medium leading-[120%]">
            Введи адресу доставки
          </p>
        )}

        {/* Інпути */}
        <div className="flex flex-col gap-4">
          {/* Якщо Нова пошта → працюємо з LocationInput */}
          {values.deliveryService === DeliveryService.NOVA_POSHTA && (
            <>
              <LocationInput
                fieldName="city"
                placeholder={"Назва населеного пункту"}
                options={filteredCities}
                isLoading={isLoadingCities}
                emptyMessage={
                  hasCitySearchResult ? "Нічого не знайдено" : undefined
                }
                isDropDownOpen={isCitiesDropDownOpen}
                setIsDropDownOpen={setIsCitiesDropDownOpen}
                onChange={onCitiesLocationInputChange}
                onSelect={(city) => {
                  cancelCitySearch();
                  setSelectedCity({
                    description: city.description,
                    ref: city.key,
                  });
                  setFieldValue("city", city.description);
                  setIsCitiesDropDownOpen(false);
                }}
              />

              {values.deliveryType !== DeliveryType.COURIER ? (
                <LocationInput
                  fieldName="branchNumber"
                  placeholder={
                    values.deliveryType === DeliveryType.BRANCH
                      ? "Номер відділення"
                      : "Номер поштомату"
                  }
                  options={filteredWarehouses}
                  isLoading={isLoadingWarehouses}
                  isDropDownOpen={isWarehousesDropDownOpen}
                  setIsDropDownOpen={setIsWarehousesDropDownOpen}
                  onChange={onWarehousesInputChange}
                  onSelect={(branch) => {
                    setFieldValue("branchNumber", branch.description);
                    setIsWarehousesDropDownOpen(false);
                  }}
                />
              ) : (
                <CustomizedInput
                  fieldName="address"
                  placeholder={"Адреса"}
                  isRequired
                  errors={errors}
                  touched={touched}
                />
              )}
            </>
          )}

          {/* Якщо Укрпошта → просто інпути */}
          {values.deliveryService === DeliveryService.UKRPOSHTA && (
            <>
              <CustomizedInput
                fieldName="city"
                placeholder="Місто"
                isRequired
                errors={errors}
                touched={touched}
              />

              <CustomizedInput
                fieldName={
                  values.deliveryType === DeliveryType.COURIER
                    ? "address"
                    : "branchNumber"
                }
                placeholder={
                  values.deliveryType === DeliveryType.COURIER
                    ? "Адреса"
                    : values.deliveryType === DeliveryType.BRANCH
                      ? "Номер відділення"
                      : "Номер поштомату"
                }
                isRequired
                errors={errors}
                touched={touched}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

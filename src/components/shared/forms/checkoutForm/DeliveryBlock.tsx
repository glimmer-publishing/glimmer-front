"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useFormikContext, ErrorMessage } from "formik";
import CustomizedInput from "../../formComponents/CustomizedInput";
import RadioButtonInput from "../../formComponents/RadioButtonInput";
import LocationInput from "../../formComponents/LocationInput";
import { getNPBranches } from "@/utils/getNpBranches";
import { searchNPCities } from "@/utils/getNPCities";

/* Nova Poshta is searched once the customer has typed this many characters,
   and this long after they stop typing. */
const CITY_SEARCH_MIN_LENGTH = 2;
const CITY_SEARCH_DEBOUNCE_MS = 300;

interface Warehouse {
  Description: string;
  Ref: string;
  CategoryOfWarehouse: string;
}

interface Values {
  [fieldName: string]: string;
}

const deliveryServices = [
  {
    label: "Нова пошта",
    logo: "/images/deliveryPage/deliveryConditions/novaPost.svg",
  },
  {
    label: "Укрпошта",
    logo: "/images/deliveryPage/deliveryConditions/ukrPost.svg",
  },
];

export default function DeliveryBlock() {
  const [isCitiesDropDownOpen, setIsCitiesDropDownOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState<
    { key: string; description: string }[]
  >([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [hasCitySearchResult, setHasCitySearchResult] = useState(false);
  // The city picked from the dropdown, with the Ref its branches are loaded
  // by. Only a picked city counts: LocationInput clears unpicked text on blur.
  const [selectedCity, setSelectedCity] = useState<{
    description: string;
    ref: string;
  } | null>(null);
  const citySearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Increments per search; a response for an older search is ignored.
  const citySearchId = useRef(0);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoadingWarehouses, setIsLoadingWarehouses] = useState(false);
  const [filteredWarehouses, setFilteredWarehouses] = useState<
    { key: string; description: string }[]
  >([]);
  const [isWarehousesDropDownOpen, setIsWarehousesDropDownOpen] =
    useState(false);

  const deliveryTypes = [
    { label: "Відділення", value: "Відділення" },
    { label: "Доставка кур’єром", value: "Доставка кур’єром" },
    { label: "Поштомат", value: "Поштомат" },
  ];

  const { values, setFieldValue, errors, touched, handleChange } =
    useFormikContext<Values>();

  useEffect(() => {
    setFieldValue("deliveryType", "Відділення");
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

    getNPBranches(selectedCity.ref)
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
      searchNPCities(inputValue).then((cities) => {
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
          {deliveryTypes.map((type, idx) => (
            <RadioButtonInput
              key={idx}
              fieldName="deliveryType"
              value={type.value}
              onClick={() => setFieldValue("deliveryType", type.value)}
              label={type.label}
            />
          ))}
        </div>
        {values.deliveryService === "Укрпошта" ? (
          values.deliveryType !== "Доставка кур’єром" ? (
            <p className="mb-6 text-[14px] lg:text-[15px] font-medium leading-[120%]">
              Обери <span className="lowercase">{values.deliveryType}</span>{" "}
              Укрпошти
            </p>
          ) : (
            <p className="mb-6 text-[14px] lg:text-[15px] font-medium leading-[120%]">
              Введи адресу доставки
            </p>
          )
        ) : values.deliveryType !== "Доставка кур’єром" ? (
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
          {values.deliveryService === "Нова пошта" ? (
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

              {values.deliveryType !== "Доставка кур’єром" ? (
                <LocationInput
                  fieldName="branchNumber"
                  placeholder={
                    values.deliveryType === "Відділення"
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
          ) : null}

          {/* Якщо Укрпошта → просто інпути */}
          {values.deliveryService === "Укрпошта" && (
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
                  values.deliveryType === "Доставка кур’єром"
                    ? "address"
                    : "branchNumber"
                }
                placeholder={
                  values.deliveryType === "Доставка кур’єром"
                    ? "Адреса"
                    : values.deliveryType === "Відділення"
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

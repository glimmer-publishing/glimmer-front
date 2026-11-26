"use client";
import { useEffect, useRef } from "react";
import { useFormikContext } from "formik";
import { DeliveryService } from "@/shared/config/enums";
import type { CheckoutValues } from "../model/schema";
import CheckoutDeliveryHint from "./CheckoutDeliveryHint";
import CheckoutDeliveryServicePicker from "./CheckoutDeliveryServicePicker";
import CheckoutDeliveryTypePicker from "./CheckoutDeliveryTypePicker";
import CheckoutNovaPoshtaFields from "./CheckoutNovaPoshtaFields";
import CheckoutUkrposhtaFields from "./CheckoutUkrposhtaFields";

/**
 * The "Доставка" section: service, then delivery type, then the address
 * fields of that service. Changing the service clears the address, since a
 * Nova Poshta branch means nothing to Укрпошта.
 */
export default function CheckoutDelivery() {
  const { values, setFieldValue } = useFormikContext<CheckoutValues>();
  const previousService = useRef(values.deliveryService);

  useEffect(() => {
    if (previousService.current === values.deliveryService) return;
    previousService.current = values.deliveryService;

    setFieldValue("city", "");
    setFieldValue("branchNumber", "");
    setFieldValue("address", "");
  }, [values.deliveryService, setFieldValue]);

  return (
    <>
      <CheckoutDeliveryServicePicker />
      <div
        className={`pb-3 transition-[max-height] duration-500 ${
          values.deliveryService ? "max-h-[500px] ease-in" : "max-h-0 ease-out"
        }`}
      >
        <CheckoutDeliveryTypePicker />
        <CheckoutDeliveryHint />
        <div className="flex flex-col gap-4">
          {values.deliveryService === DeliveryService.NOVA_POSHTA && (
            <CheckoutNovaPoshtaFields />
          )}
          {values.deliveryService === DeliveryService.UKRPOSHTA && (
            <CheckoutUkrposhtaFields />
          )}
        </div>
      </div>
    </>
  );
}

"use client";
import { useFormikContext } from "formik";
import { DeliveryType } from "@/shared/config/enums";
import FormInput from "@/shared/ui/form/FormInput";
import type { CheckoutValues } from "../model/schema";

/**
 * Укрпошта has no lookup: the city, and the branch number or the courier
 * address, are free text.
 */
export default function CheckoutUkrposhtaFields() {
  const { values, errors, touched } = useFormikContext<CheckoutValues>();
  const isCourier = values.deliveryType === DeliveryType.COURIER;

  return (
    <>
      <FormInput
        fieldName="city"
        placeholder="Місто"
        isRequired
        errors={errors}
        touched={touched}
      />
      <FormInput
        fieldName={isCourier ? "address" : "branchNumber"}
        placeholder={
          isCourier
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
  );
}

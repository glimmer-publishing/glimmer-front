"use client";
import { useFormikContext } from "formik";
import { DeliveryType } from "@/shared/config/enums";
import FormRadioInput from "@/shared/ui/form/FormRadioInput";
import type { CheckoutValues } from "../model/schema";

/* Every delivery type, in the enum's order. */
const DELIVERY_TYPES = Object.values(DeliveryType);

/**
 * Radio buttons for branch, parcel locker or courier.
 */
export default function CheckoutDeliveryTypePicker() {
  const { setFieldValue } = useFormikContext<CheckoutValues>();

  return (
    <div className="flex flex-col gap-4 my-6">
      {DELIVERY_TYPES.map((type) => (
        <FormRadioInput
          key={type}
          fieldName="deliveryType"
          value={type}
          onClick={() => setFieldValue("deliveryType", type)}
          label={type}
        />
      ))}
    </div>
  );
}

"use client";
import Image from "next/image";
import { ErrorMessage, useFormikContext } from "formik";
import { DeliveryService } from "@/shared/config/enums";
import type { CheckoutValues } from "../model/schema";

/* The delivery services offered, with the logo on their button. */
const DELIVERY_SERVICES = [
  {
    label: DeliveryService.NOVA_POSHTA,
    logo: "/images/deliveryPage/deliveryConditions/novaPost.svg",
  },
  {
    label: DeliveryService.UKRPOSHTA,
    logo: "/images/deliveryPage/deliveryConditions/ukrPost.svg",
  },
];

/**
 * Two logo buttons that pick the delivery service, with the field error
 * under them.
 */
export default function CheckoutDeliveryServicePicker() {
  const { values, setFieldValue } = useFormikContext<CheckoutValues>();

  return (
    <div className="relative">
      <div className="flex gap-4 lg:gap-8">
        {DELIVERY_SERVICES.map((service) => (
          <button
            type="button"
            key={service.label}
            onClick={() => setFieldValue("deliveryService", service.label)}
            className={`cursor-pointer flex items-center gap-2 w-1/2 h-12 rounded-[12px] p-3 justify-center shadow-sm ${
              values.deliveryService === service.label ? "bg-main" : "bg-white"
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
        name="deliveryService"
        component="p"
        className="absolute bottom-[-11px] left-2 text-[9px] font-normal leading-none text-red-500"
      />
    </div>
  );
}

"use client";
import { useFormikContext } from "formik";
import { DeliveryService, DeliveryType } from "@/shared/config/enums";
import type { CheckoutValues } from "../model/schema";

/* The service's name in the genitive, as the hint says it. */
const SERVICE_GENITIVE: Record<DeliveryService, string> = {
  [DeliveryService.NOVA_POSHTA]: "Нової пошти",
  [DeliveryService.UKRPOSHTA]: "Укрпошти",
};

/**
 * One line telling the customer what to fill in next: the address for a
 * courier, otherwise which kind of branch of which service.
 */
export default function CheckoutDeliveryHint() {
  const { values } = useFormikContext<CheckoutValues>();
  const className =
    "mb-6 text-[14px] lg:text-[15px] font-medium leading-[120%]";

  if (values.deliveryType === DeliveryType.COURIER) {
    return <p className={className}>Введи адресу доставки</p>;
  }

  return (
    <p className={className}>
      Обери <span className="lowercase">{values.deliveryType}</span>{" "}
      {SERVICE_GENITIVE[values.deliveryService]}
    </p>
  );
}

"use client";
import { useFormikContext } from "formik";
import { useEffect } from "react";
import { DeliveryService, PaymentOption } from "@/constants/enums";
import type { CartQuote } from "@/entities/cart/model/types";
import RadioButtonInput from "@/shared/ui/form/RadioButtonInput";

interface PaymentBlockProps {
  /* The server's quote of the cart; the options depend on its products. */
  quote?: CartQuote;
}

/**
 * Payment options offered for this cart and delivery. The server enforces
 * the same rules when the order is placed; hiding an option here is only
 * for the customer.
 */
export default function PaymentBlock({ quote }: PaymentBlockProps) {
  const lines = quote?.lines ?? [];
  const hasPreorder = lines.some((line) => line.status === "preOrder");
  const isNationalCashbackAvailable =
    lines.length > 0 && lines.every((line) => line.isNationalCashback === true);

  const { values, setFieldValue } = useFormikContext<{
    deliveryService: DeliveryService;
    payment: PaymentOption;
  }>();

  const isUkrposhta = values.deliveryService === DeliveryService.UKRPOSHTA;

  useEffect(() => {
    if (
      (isUkrposhta || hasPreorder) &&
      values.payment === PaymentOption.CASH_ON_DELIVERY
    ) {
      setFieldValue("payment", PaymentOption.CARD);
    }
  }, [isUkrposhta, hasPreorder, values.payment, setFieldValue]);

  useEffect(() => {
    if (
      quote &&
      values.payment === PaymentOption.NATIONAL_CASHBACK &&
      !isNationalCashbackAvailable
    ) {
      setFieldValue("payment", PaymentOption.CARD);
    }
  }, [quote, isNationalCashbackAvailable, values.payment, setFieldValue]);

  return (
    <div className="flex flex-col gap-4">
      <RadioButtonInput
        fieldName="payment"
        label={PaymentOption.CARD}
        value={PaymentOption.CARD}
      />
      {isNationalCashbackAvailable && (
        <RadioButtonInput
          fieldName="payment"
          label={PaymentOption.NATIONAL_CASHBACK}
          value={PaymentOption.NATIONAL_CASHBACK}
        />
      )}
      {!isUkrposhta && !hasPreorder && (
        <RadioButtonInput
          fieldName="payment"
          label={PaymentOption.CASH_ON_DELIVERY}
          value={PaymentOption.CASH_ON_DELIVERY}
        />
      )}
    </div>
  );
}

"use client";
import { useFormikContext } from "formik";
import { useEffect } from "react";
import { DeliveryService, PaymentOption } from "@/constants/enums";
import type { CartQuote } from "@/entities/cart/model/types";
import RadioButtonInput from "@/shared/ui/form/RadioButtonInput";
import { availablePayments } from "../lib/paymentRules";

interface PaymentBlockProps {
  /* The server's quote of the cart; the options depend on its products. */
  quote?: CartQuote;
}

/**
 * The payment options this cart and delivery allow, from the same rules
 * createOrder enforces. A choice that stops being allowed falls back to
 * card payment.
 */
export default function PaymentBlock({ quote }: PaymentBlockProps) {
  const { values, setFieldValue } = useFormikContext<{
    deliveryService: DeliveryService;
    payment: PaymentOption;
  }>();

  const available = availablePayments(
    values.deliveryService,
    quote?.lines ?? null
  );
  const isAllowed = available.includes(values.payment);

  useEffect(() => {
    if (!isAllowed) setFieldValue("payment", PaymentOption.CARD);
  }, [isAllowed, setFieldValue]);

  return (
    <div className="flex flex-col gap-4">
      {available.map((payment) => (
        <RadioButtonInput
          key={payment}
          fieldName="payment"
          label={payment}
          value={payment}
        />
      ))}
    </div>
  );
}

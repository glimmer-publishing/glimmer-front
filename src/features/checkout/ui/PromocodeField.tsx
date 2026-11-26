"use client";
import { useEffect } from "react";
import { useFormikContext } from "formik";
import type { CartQuote } from "@/entities/cart/model/types";
import { useCartStore } from "@/entities/cart/model/store";
import CustomizedInput from "@/shared/ui/form/CustomizedInput";

const PROMO_ERRORS = {
  notFound: "Промокод не знайдений",
  expired: "Термін дії промокоду вичерпано",
} as const;

interface PromocodeFieldProps {
  /* The server's quote, which says whether the stored code applies. */
  quote?: CartQuote;
  /* True while the quote for the current cart is still loading. */
  isChecking: boolean;
}

/**
 * Promo code input. Applying stores the code in the cart; the server's quote
 * then says whether it exists and has not expired, and a rejected code is
 * shown as a field error and dropped.
 */
export default function PromocodeField({
  quote,
  isChecking,
}: PromocodeFieldProps) {
  const promoCode = useCartStore((state) => state.promoCode);
  const setPromoCode = useCartStore((state) => state.setPromoCode);
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
  } = useFormikContext<{ promocode: string }>();

  useEffect(() => {
    const status = quote?.promoStatus;
    if (isChecking || !promoCode || !status) return;
    if (status !== "notFound" && status !== "expired") return;

    setPromoCode(null);
    setFieldTouched("promocode", true, false);
    setFieldError("promocode", PROMO_ERRORS[status]);
  }, [
    quote,
    isChecking,
    promoCode,
    setPromoCode,
    setFieldError,
    setFieldTouched,
  ]);

  return (
    <>
      <CustomizedInput
        fieldName="promocode"
        placeholder={"Введи свій промокод"}
        isLoading={isChecking && !!promoCode}
        errors={errors}
        touched={touched}
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          if (promoCode) {
            setPromoCode(null);
            setFieldValue("promocode", "");
          } else {
            setPromoCode(values.promocode);
          }
        }}
        type="button"
        disabled={!values.promocode}
        className="mt-1.5 block w-fit ml-auto enabled:cursor-pointer text-[10px] xl:text-[12px] font-medium leading-[120%] disabled:opacity-60 text-black/60 xl:enabled:hover:text-main
                enabled:focus-visible:text-main enabled:active:text-main transition duration-300 ease-in-out"
      >
        {promoCode ? "Видалити промокод" : "Застосувати промокод"}
      </button>
    </>
  );
}

"use client";
import { useState } from "react";
import type { FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { setCartQuote } from "@/entities/cart/hooks/useFetchCartQuote";
import { useCartStore } from "@/entities/cart/model/store";
import type { CartItem, CartQuote } from "@/entities/cart/model/types";
import { useUtmStore } from "@/entities/utm/model/store";
import { createOrder } from "../api/createOrder";
import { openPaymentPage } from "../lib/openPaymentPage";
import { useOrderStore } from "../model/orderStore";
import type { CheckoutValues } from "../model/schema";
import type { CheckoutNotice, CreateOrderResult } from "../model/types";

/* The cart the form shows, as the submit needs it. */
type SubmitOrderCart = {
  /**
   * The quote shown; nothing is submitted without one, nor while it is a
   * placeholder (drawn from the cart's snapshot or an older cart).
   */
  quote?: CartQuote;
  isPlaceholderData: boolean;
  items: CartItem[];
  /* The code the server already accepted, or null. */
  promoCode: string | null;
};

/**
 * Formik's onSubmit for the checkout form, and whether it is running. It
 * calls createOrder and handles each outcome:
 * - ok: remembers the order, clears the cart and UTM, then goes to MonoPay
 *   or to /confirmation;
 * - invalid: shows the server's field errors on their fields;
 * - priceChanged: shows the server's fresh quote and drops products that are
 *   no longer sold, then tells the customer to check the total;
 * - paymentFailed or anything else: tells the customer through onNotice.
 */
export const useSubmitOrder = (
  { quote, isPlaceholderData, items, promoCode }: SubmitOrderCart,
  onNotice: (notice: CheckoutNotice) => void
) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clearCart);
  const removeItems = useCartStore((state) => state.removeItems);
  const setOrder = useOrderStore((state) => state.setOrder);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResult = (
    result: CreateOrderResult,
    shownQuote: CartQuote,
    { setErrors, setTouched, resetForm }: FormikHelpers<CheckoutValues>
  ) => {
    switch (result.status) {
      case "ok":
        setOrder(result.order);
        clearCart();
        useUtmStore.getState().clearUtmData();
        resetForm();
        if (result.paymentUrl) openPaymentPage(result.paymentUrl);
        else router.push("/confirmation");
        return;

      case "invalid":
        setErrors(result.fieldErrors);
        setTouched(
          Object.fromEntries(
            Object.keys(result.fieldErrors).map((field) => [field, true])
          ),
          false
        );
        return;

      case "priceChanged": {
        const { missingIds } = result.quote;
        const removedTitles = shownQuote.lines
          .filter((line) => missingIds.includes(line.id))
          .map((line) => line.title);
        setCartQuote(queryClient, items, promoCode, result.quote);
        if (missingIds.length) removeItems(missingIds);
        onNotice({ kind: "priceChanged", removedTitles });
        return;
      }

      case "paymentFailed":
        onNotice({ kind: "paymentFailed", orderNumber: result.orderNumber });
        return;

      default:
        onNotice({ kind: "error" });
    }
  };

  const submitOrder = async (
    values: CheckoutValues,
    helpers: FormikHelpers<CheckoutValues>
  ) => {
    if (!quote || isPlaceholderData) return;
    setIsSubmitting(true);

    try {
      const result = await createOrder({
        items,
        /* Only the code the server already accepted counts. */
        values: { ...values, promocode: promoCode ?? "" },
        expectedTotal: quote.total,
        utm: useUtmStore.getState().utmData,
      });
      handleResult(result, quote, helpers);
    } catch (error) {
      console.error(error);
      onNotice({ kind: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitOrder, isSubmitting };
};

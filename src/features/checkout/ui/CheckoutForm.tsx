"use client";
import { ReactNode } from "react";
import { Form, Formik } from "formik";
import { useFetchCartQuote } from "@/entities/cart/hooks/useFetchCartQuote";
import { useQuotePricesChanged } from "../hooks/useQuotePricesChanged";
import { useSubmitOrder } from "../hooks/useSubmitOrder";
import {
  checkoutSchema,
  initialCheckoutValues,
  type CheckoutValues,
} from "../model/schema";
import type { CheckoutNotice } from "../model/types";
import CheckoutCustomerColumn from "./CheckoutCustomerColumn";
import CheckoutOrderColumn from "./CheckoutOrderColumn";

type CheckoutFormProps = {
  /* Shows the customer why the order did not go through. */
  onNotice: (notice: CheckoutNotice) => void;
  /* The cart's lines, shown under "Інформація про замовлення". */
  cartList: ReactNode;
  /* The cart's totals, with the form's submit button as their action. */
  renderTotal: (submit: ReactNode) => ReactNode;
};

/**
 * The checkout form. The cart, totals and payment options shown come from
 * the server's quote; submitting calls createOrder (useSubmitOrder), which
 * re-validates and re-prices everything before anything is created or
 * charged. The cart may first be drawn from its snapshot; if the server's
 * prices then differ, the totals say so. Renders nothing until the cart is
 * read from localStorage.
 */
export default function CheckoutForm({
  onNotice,
  cartList,
  renderTotal,
}: CheckoutFormProps) {
  const { quote, items, promoCode, hydrated, isFetching, isPlaceholderData } =
    useFetchCartQuote();
  const { submitOrder, isSubmitting } = useSubmitOrder(
    { quote, isPlaceholderData, items, promoCode },
    onNotice
  );
  const pricesChanged = useQuotePricesChanged(
    quote,
    isPlaceholderData,
    promoCode
  );

  if (!hydrated) return null;

  return (
    <Formik<CheckoutValues>
      initialValues={initialCheckoutValues(promoCode)}
      onSubmit={submitOrder}
      validationSchema={checkoutSchema}
    >
      <Form className="relative flex flex-col md:flex-row md:gap-8 w-full">
        <CheckoutCustomerColumn quote={quote} />
        <CheckoutOrderColumn
          quote={quote}
          isQuoteStale={isFetching || isPlaceholderData}
          isQuoteFetching={isFetching}
          pricesChanged={pricesChanged}
          isSubmitting={isSubmitting}
          cartList={cartList}
          renderTotal={renderTotal}
        />
      </Form>
    </Formik>
  );
}

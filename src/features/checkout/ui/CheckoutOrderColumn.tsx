"use client";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useFormikContext } from "formik";
import type { CartQuote } from "@/entities/cart/model/types";
import { listItemVariants } from "@/shared/lib/animation/animationVariants";
import MainButton from "@/shared/ui/main-button/MainButton";
import type { CheckoutValues } from "../model/schema";
import CheckoutColumn from "./CheckoutColumn";
import CheckoutPromocodeField from "./CheckoutPromocodeField";
import CheckoutRecommendations from "./CheckoutRecommendations";
import CheckoutSection from "./CheckoutSection";

type CheckoutOrderColumnProps = {
  /* The server's quote of the cart, or undefined while it loads. */
  quote?: CartQuote;
  /* True while the quote is refetching or is a placeholder for the cart. */
  isQuoteStale: boolean;
  /* True while a quote request is in flight. */
  isQuoteFetching: boolean;
  /* True while createOrder runs. */
  isSubmitting: boolean;
  /* The cart's lines, from the cart widget. */
  cartList: ReactNode;
  /* The cart's totals, given the submit button as their action. */
  renderTotal: (submit: ReactNode) => ReactNode;
};

/**
 * The right column: the cart and suggestions, the promo code, and the
 * totals with the submit button. Submitting is allowed only for a valid
 * form and a current, non-zero quote, so the customer always confirms the
 * total createOrder will check.
 */
export default function CheckoutOrderColumn({
  quote,
  isQuoteStale,
  isQuoteFetching,
  isSubmitting,
  cartList,
  renderTotal,
}: CheckoutOrderColumnProps) {
  const { dirty, isValid } = useFormikContext<CheckoutValues>();
  const canSubmit =
    dirty && isValid && !!quote?.total && !isQuoteStale && !isSubmitting;

  return (
    <CheckoutColumn className="flex flex-col md:gap-6 w-full md:w-[calc(50%-16px)] h-fit md:p-8 md:rounded-[12px] md:shadow-sm md:overflow-hidden border-t md:border-none border-black/10">
      <CheckoutSection
        title="Інформація про замовлення"
        className="py-4 md:p-0"
      >
        {cartList}
        <CheckoutRecommendations lines={quote?.lines ?? []} />
      </CheckoutSection>
      <CheckoutSection
        title="Промокод"
        className="py-6 md:p-8 md:rounded-[12px] border-t md:border-none border-black/10 md:shadow-sm"
      >
        <CheckoutPromocodeField quote={quote} isChecking={isQuoteFetching} />
      </CheckoutSection>

      <motion.div
        viewport={{ once: true, amount: 0.2 }}
        variants={listItemVariants}
        className="py-6 md:p-0 border-t md:border-none border-black/10"
      >
        {renderTotal(
          <MainButton
            type="submit"
            disabled={!canSubmit}
            isLoading={isSubmitting}
            loadingText="Надсилання..."
            className="h-[45px]"
          >
            Оформити замовлення
          </MainButton>
        )}
      </motion.div>
    </CheckoutColumn>
  );
}

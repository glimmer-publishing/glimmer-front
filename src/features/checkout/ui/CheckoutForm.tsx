"use client";
import { Form, Formik, FormikHelpers } from "formik";
import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { CART_QUOTE_KEY, useCartQuote } from "@/entities/cart/api/useCartQuote";
import { cartQuoteHref } from "@/entities/cart/model/cartHref";
import { useCartStore } from "@/entities/cart/model/store";
import CartList from "@/entities/cart/ui/CartList";
import CartTotal from "@/entities/cart/ui/CartTotal";
import CustomizedInput from "@/shared/ui/form/CustomizedInput";
import MainButton from "@/shared/ui/main-button/MainButton";
import { useUtmStore } from "@/store/utmStore";
import { listItemVariants, listVariants } from "@/utils/animationVariants";
import { createOrder } from "../api/createOrder";
import { useOrderStore } from "../model/orderStore";
import {
  checkoutSchema,
  initialCheckoutValues,
  type CheckoutValues,
} from "../model/schema";
import CheckoutRecommendations from "./CheckoutRecommendations";
import CheckoutSubTitle from "./CheckoutSubtitle";
import ContactsBlock from "./ContactsBlock";
import DeliveryBlock from "./DeliveryBlock";
import PaymentBlock from "./PaymentBlock";
import PromocodeField from "./PromocodeField";

/* Why an order was not placed, or not paid. */
export type CheckoutNotice =
  | { kind: "error" }
  | { kind: "priceChanged" }
  | { kind: "paymentFailed"; orderNumber: string };

interface CheckoutFormProps {
  /* Shows the customer why the order did not go through. */
  onNotice: (notice: CheckoutNotice) => void;
}

/* MonoPay's payment page is opened with a POST, as MonoPay expects. */
const openPaymentPage = (url: string) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = url;
  form.style.display = "none";
  document.body.appendChild(form);
  form.submit();
};

interface CheckoutSectionProps {
  /* The section heading. */
  title: string;
  /* The section's fields. */
  children: ReactNode;
  /* Extra classes for the card. */
  className?: string;
}

/**
 * One animated card of the checkout form.
 */
function CheckoutSection({ title, children, className }: CheckoutSectionProps) {
  return (
    <motion.div
      viewport={{ once: true, amount: 0.2 }}
      variants={listItemVariants}
      className={
        className ??
        "py-9 md:p-8 md:rounded-[12px] border-t md:border-none border-black/10 md:shadow-sm"
      }
    >
      <CheckoutSubTitle>{title}</CheckoutSubTitle>
      {children}
    </motion.div>
  );
}

/**
 * The checkout form. The cart, totals and payment options shown come from
 * the server's quote; submitting calls createOrder, which re-validates and
 * re-prices everything before anything is created or charged.
 */
export default function CheckoutForm({ onNotice }: CheckoutFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { quote, items, promoCode, hydrated, isFetching, isPlaceholderData } =
    useCartQuote();
  const clearCart = useCartStore((state) => state.clearCart);
  const removeItems = useCartStore((state) => state.removeItems);
  const setOrder = useOrderStore((state) => state.setOrder);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!hydrated) return null;

  const isQuoteCurrent = !!quote && !isFetching && !isPlaceholderData;

  const submitForm = async (
    values: CheckoutValues,
    { setErrors, setTouched, resetForm }: FormikHelpers<CheckoutValues>
  ) => {
    if (!quote) return;
    setIsSubmitting(true);

    try {
      const result = await createOrder({
        items,
        /* Only the code the server already accepted counts. */
        values: { ...values, promocode: promoCode ?? "" },
        expectedTotal: quote.total,
        utm: useUtmStore.getState().utmData,
      });

      switch (result.status) {
        case "ok": {
          setOrder(result.order);
          clearCart();
          useUtmStore.getState().clearUtmData();
          resetForm();
          if (result.paymentUrl) openPaymentPage(result.paymentUrl);
          else router.push("/confirmation");
          return;
        }
        case "invalid": {
          setErrors(result.fieldErrors);
          setTouched(
            Object.fromEntries(
              Object.keys(result.fieldErrors).map((field) => [field, true])
            ),
            false
          );
          return;
        }
        case "priceChanged": {
          queryClient.setQueryData(
            [CART_QUOTE_KEY, cartQuoteHref(items, promoCode)],
            result.quote
          );
          if (result.quote.missingIds.length) {
            removeItems(result.quote.missingIds);
          }
          onNotice({ kind: "priceChanged" });
          return;
        }
        case "paymentFailed": {
          onNotice({ kind: "paymentFailed", orderNumber: result.orderNumber });
          return;
        }
        default:
          onNotice({ kind: "error" });
      }
    } catch (error) {
      console.error(error);
      onNotice({ kind: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Formik<CheckoutValues>
      initialValues={initialCheckoutValues(promoCode)}
      onSubmit={submitForm}
      validationSchema={checkoutSchema}
    >
      {({ errors, touched, dirty, isValid }) => (
        <Form className="relative flex flex-col md:flex-row md:gap-8 w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: true, amount: 0.2 }}
            variants={listVariants({
              staggerChildren: 0.2,
              delayChildren: 0.4,
            })}
            className="flex flex-col md:gap-8 w-full md:w-[calc(50%-16px)]"
          >
            <CheckoutSection title="Контактна інформація">
              <ContactsBlock />
            </CheckoutSection>
            <CheckoutSection title="Доставка">
              <DeliveryBlock />
            </CheckoutSection>
            <CheckoutSection title="Оплата">
              <PaymentBlock quote={quote} />
            </CheckoutSection>
            <CheckoutSection title="Додати коментар">
              <CustomizedInput
                fieldName="message"
                as="textarea"
                placeholder={"Повідомлення"}
                errors={errors}
                touched={touched}
                fieldClassName="h-[120px] lg:h-[160px] py-4 rounded-[12px]"
              />
            </CheckoutSection>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: true, amount: 0.2 }}
            variants={listVariants({
              staggerChildren: 0.2,
              delayChildren: 0.4,
            })}
            className="flex flex-col md:gap-6 w-full md:w-[calc(50%-16px)] h-fit md:p-8 md:rounded-[12px] md:shadow-sm md:overflow-hidden border-t md:border-none border-black/10"
          >
            <CheckoutSection
              title="Інформація про замовлення"
              className="py-4 md:p-0"
            >
              <CartList
                variant="checkout"
                className="max-h-[201px] lg:max-h-[234px]"
              />
              <CheckoutRecommendations lines={quote?.lines ?? []} />
            </CheckoutSection>
            <CheckoutSection
              title="Промокод"
              className="py-6 md:p-8 md:rounded-[12px] border-t md:border-none border-black/10 md:shadow-sm"
            >
              <PromocodeField quote={quote} isChecking={isFetching} />
            </CheckoutSection>

            <motion.div
              viewport={{ once: true, amount: 0.2 }}
              variants={listItemVariants}
              className="py-6 md:p-0 border-t md:border-none border-black/10"
            >
              <CartTotal
                variant="checkout"
                action={
                  <MainButton
                    type="submit"
                    disabled={
                      !(dirty && isValid && isQuoteCurrent && !!quote?.total) ||
                      isSubmitting
                    }
                    isLoading={isSubmitting}
                    loadingText="Надсилання..."
                    className="h-[45px]"
                  >
                    Оформити замовлення
                  </MainButton>
                }
              />
            </motion.div>
          </motion.div>
        </Form>
      )}
    </Formik>
  );
}

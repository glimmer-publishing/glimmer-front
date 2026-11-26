"use client";
import { useFormikContext } from "formik";
import type { CartQuote } from "@/entities/cart/model/types";
import FormInput from "@/shared/ui/form/FormInput";
import type { CheckoutValues } from "../model/schema";
import CheckoutColumn from "./CheckoutColumn";
import CheckoutContacts from "./CheckoutContacts";
import CheckoutDelivery from "./CheckoutDelivery";
import CheckoutPayment from "./CheckoutPayment";
import CheckoutSection from "./CheckoutSection";

type CheckoutCustomerColumnProps = {
  /* The server's quote; the payment options depend on its products. */
  quote?: CartQuote;
};

/**
 * The left column: who orders, where it goes, how it is paid, and an
 * optional comment.
 */
export default function CheckoutCustomerColumn({
  quote,
}: CheckoutCustomerColumnProps) {
  const { errors, touched } = useFormikContext<CheckoutValues>();

  return (
    <CheckoutColumn className="flex flex-col md:gap-8 w-full md:w-[calc(50%-16px)]">
      <CheckoutSection title="Контактна інформація">
        <CheckoutContacts />
      </CheckoutSection>
      <CheckoutSection title="Доставка">
        <CheckoutDelivery />
      </CheckoutSection>
      <CheckoutSection title="Оплата">
        <CheckoutPayment quote={quote} />
      </CheckoutSection>
      <CheckoutSection title="Додати коментар">
        <FormInput
          fieldName="message"
          as="textarea"
          placeholder="Повідомлення"
          errors={errors}
          touched={touched}
          fieldClassName="h-[120px] lg:h-[160px] py-4 rounded-[12px]"
        />
      </CheckoutSection>
    </CheckoutColumn>
  );
}

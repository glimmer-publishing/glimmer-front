import * as yup from "yup";
import {
  DeliveryService,
  DeliveryType,
  PaymentOption,
} from "@/shared/config/enums";
import { MAX_PROMO_LENGTH } from "@/entities/cart/model/constants";
import {
  checkoutPhoneRegex,
  emailRegex,
  nameRegex,
} from "@/shared/lib/text/regex";
import { paymentError } from "../lib/paymentRules";

/* Field error messages shared by several fields. */
const REQUIRED = "Дане поле є обов'язковим до заповнення";
const NAME_LENGTH = "Повинно містити від 2 до 30 символів";
const TOO_LONG = "Занадто довге значення";

/* Whether a delivery type needs a branch or parcel locker number. */
const needsBranch = (type: string) =>
  type === DeliveryType.BRANCH || type === DeliveryType.PARCEL_LOCKER;

/**
 * The checkout form, validated by the form in the browser and again by
 * createOrder on the server, so both reject the same input.
 */
export const checkoutSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, NAME_LENGTH)
    .max(30, NAME_LENGTH)
    .matches(nameRegex, "Допустимі літери та дефіс, апостроф, лапки")
    .required(REQUIRED),
  surname: yup
    .string()
    .trim()
    .min(2, NAME_LENGTH)
    .max(30, NAME_LENGTH)
    .matches(nameRegex, "Допустимі літери та дефіс, апостроф, лапки")
    .required(REQUIRED),
  phone: yup
    .string()
    .trim()
    .matches(checkoutPhoneRegex, "Вкажіть правильний номер телефону")
    .test(
      "sixth-char-zero",
      "Після +38 має бути цифра 0",
      (value) => !!value && value.length >= 6 && value[5] === "0"
    )
    .required(REQUIRED),
  email: yup
    .string()
    .trim()
    .max(100, TOO_LONG)
    .matches(emailRegex, "Введіть валідний email")
    .required(REQUIRED),
  deliveryService: yup
    .mixed<DeliveryService>()
    .oneOf(Object.values(DeliveryService), "Оберіть сервіс доставки")
    .required("Оберіть сервіс доставки"),
  deliveryType: yup
    .mixed<DeliveryType>()
    .oneOf(Object.values(DeliveryType), "Оберіть спосіб доставки")
    .required("Оберіть спосіб доставки"),
  city: yup.string().trim().max(150, TOO_LONG).required(REQUIRED),
  branchNumber: yup
    .string()
    .trim()
    .max(200, TOO_LONG)
    .when("deliveryType", {
      is: needsBranch,
      then: (schema) => schema.required(REQUIRED),
      otherwise: (schema) => schema.notRequired(),
    })
    .default(""),
  address: yup
    .string()
    .trim()
    .max(200, TOO_LONG)
    .when("deliveryType", {
      is: DeliveryType.COURIER,
      then: (schema) => schema.required(REQUIRED),
      otherwise: (schema) => schema.notRequired(),
    })
    .default(""),
  payment: yup
    .mixed<PaymentOption>()
    .oneOf(Object.values(PaymentOption), "Оберіть спосіб оплати")
    .required("Оберіть спосіб оплати")
    .test("payment-allowed", (payment, { parent, createError }) => {
      const error =
        payment && paymentError(payment, parent.deliveryService, null);
      return error ? createError({ message: error }) : true;
    }),
  message: yup.string().trim().max(1000, TOO_LONG).default(""),
  promocode: yup.string().trim().max(MAX_PROMO_LENGTH, TOO_LONG).default(""),
});

/* The checkout form's values, as the schema cleans them. */
export type CheckoutValues = yup.InferType<typeof checkoutSchema>;

/* The form's starting values. */
export const initialCheckoutValues = (promocode: string | null) => ({
  name: "",
  surname: "",
  phone: "",
  email: "",
  deliveryService: DeliveryService.NOVA_POSHTA,
  deliveryType: DeliveryType.BRANCH,
  city: "",
  branchNumber: "",
  address: "",
  payment: PaymentOption.CARD,
  message: "",
  promocode: promocode ?? "",
});

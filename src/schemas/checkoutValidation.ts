import * as yup from "yup";
import { nameRegex, emailRegex, checkoutPhoneRegex } from "../regex/regex";

export const checkoutValidation = () => {
  const checkoutValidationSchema = yup.object().shape({
    name: yup
      .string()
      .min(2, "Повинно містити від 2 до 30 символів")
      .max(30, "Повинно містити від 2 до 30 символів")
      .matches(nameRegex, "Допустимі літери та дефіс, апостроф, лапки")
      .required("Дане поле є обов'язковим до заповнення"),
    surname: yup
      .string()
      .min(2, "Повинно містити від 2 до 30 символів")
      .max(30, "Повинно містити від 2 до 30 символів")
      .matches(nameRegex, "Допустимі літери та дефіс, апостроф, лапки")
      .required("Дане поле є обов'язковим до заповнення"),
    phone: yup
      .string()
      .matches(checkoutPhoneRegex, "Вкажіть правильний номер телефону")
      .test(
        "sixth-char-zero",
        "Після +38 має бути цифра 0",
        (value) => !!value && value.length >= 6 && value[5] === "0"
      )
      .required("Дане поле є обов'язковим до заповнення"),
    email: yup
      .string()
      .matches(emailRegex, "Введіть валідний email")
      .required("Дане поле є обов'язковим до заповнення"),
    deliveryService: yup.string().required("Оберіть сервіс доставки"),
    deliveryType: yup.string().when("deliveryService", {
      is: "Міжнародна доставка",
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required("Оберіть спосіб доставки"),
    }),
    city: yup.string().when("deliveryService", {
      is: "Міжнародна доставка",
      then: (schema) => schema.notRequired(),
      otherwise: (schema) =>
        schema.required("Дане поле є обов'язковим до заповнення"),
    }),
    branchNumber: yup.string().when(["deliveryService", "deliveryType"], {
      is: (service: string, type: string) =>
        service !== "Міжнародна доставка" &&
        (type === "Відділення" || type === "Поштомат"),
      then: (schema) =>
        schema.required("Дане поле є обов'язковим до заповнення"),
      otherwise: (schema) => schema.notRequired(),
    }),
    address: yup.string().when(["deliveryService", "deliveryType"], {
      is: (service: string, type: string) =>
        service !== "Міжнародна доставка" && type === "Доставка кур'єром",
      then: (schema) =>
        schema.required("Дане поле є обов'язковим до заповнення"),
      otherwise: (schema) => schema.notRequired(),
    }),
    internationalAddress: yup.string().when("deliveryService", {
      is: "Міжнародна доставка",
      then: (schema) =>
        schema
          .min(3, "Мінімум 3 символи")
          .required("Дане поле є обов'язковим до заповнення"),
      otherwise: (schema) => schema.notRequired(),
    }),
    internationalPhone: yup.string().when("deliveryService", {
      is: "Міжнародна доставка",
      then: (schema) =>
        schema
          .min(7, "Мінімум 7 символів")
          .required("Дане поле є обов'язковим до заповнення"),
      otherwise: (schema) => schema.notRequired(),
    }),
    payment: yup.string(),
    message: yup.string(),
    promocode: yup.string(),
  });

  return checkoutValidationSchema;
};

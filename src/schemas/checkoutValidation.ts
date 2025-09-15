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
    deliveryType: yup.string().required("Оберіть спосіб доставки"),
    city: yup.string().required("Дане поле є обов'язковим до заповнення"),
    branchNumber: yup.string().when("deliveryType", {
      is: (val: string) => val === "Відділення" || val === "Поштомат",
      then: (schema) =>
        schema.required("Дане поле є обов'язковим до заповнення"),
      otherwise: (schema) => schema.notRequired(),
    }),
    address: yup.string().when("deliveryType", {
      is: (val: string) => val === "Доставка кур’єром",
      then: (schema) =>
        schema.required("Дане поле є обов'язковим до заповнення"),
      otherwise: (schema) => schema.notRequired(),
    }),
    payment: yup.string(),
    message: yup.string(),
    promocode: yup.string(),
  });

  return checkoutValidationSchema;
};

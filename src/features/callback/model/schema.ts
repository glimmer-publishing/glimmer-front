import * as yup from "yup";
import { nameRegex, emailRegex } from "@/shared/lib/text/regex";

/* The callback form's schema, shared by the form and POST /api/telegram. */
export const callbackSchema = yup.object({
  name: yup
    .string()
    .min(2, "Повинно містити від 2 до 30 символів")
    .max(30, "Повинно містити від 2 до 30 символів")
    .matches(nameRegex, "Допустимі літери та дефіс, апостроф, лапки")
    .required("Дане поле є обов'язковим до заповнення"),
  email: yup
    .string()
    .matches(emailRegex, "Введіть валідний email")
    .required("Дане поле є обов'язковим до заповнення"),
  message: yup
    .string()
    .min(2, "Повинно містити від 2 до 200 символів")
    .max(200, "Повинно містити від 2 до 200 символів")
    .required("Дане поле є обов'язковим до заповнення"),
});

/* The callback form's fields. */
export type CallbackFormValues = yup.InferType<typeof callbackSchema>;

import * as yup from "yup";
import { nameRegex, emailRegex } from "../regex/regex";

export const callBackValidation = () => {
  const callBackFormValidationSchema = yup.object().shape({
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

  return callBackFormValidationSchema;
};

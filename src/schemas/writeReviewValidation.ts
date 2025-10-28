import * as yup from "yup";
import { nameRegex, emailRegex } from "../regex/regex";

export const writeReviewValidation = () => {
  const writeReviewFormValidationSchema = yup.object().shape({
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
    rating: yup.number().min(1, "Оберіть рейтинг").required("Оберіть рейтинг"),
    message: yup
      .string()
      .min(2, "Повинно містити від 2 до 500 символів")
      .max(500, "Повинно містити від 2 до 500 символів")
      .required("Дане поле є обов'язковим до заповнення"),
  });

  return writeReviewFormValidationSchema;
};

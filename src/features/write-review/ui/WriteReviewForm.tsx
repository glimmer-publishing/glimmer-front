"use client";
import { Form, Formik, FormikHelpers } from "formik";
import { postJson } from "@/shared/api/http/fetchJson";
import { Dispatch, SetStateAction, useState } from "react";

import { writeReviewValidation } from "../model/schema";

import FormInput from "@/shared/ui/form/FormInput";
import MainButton from "@/shared/ui/main-button/MainButton";
import RatingField from "@/shared/ui/rating-field/RatingField";
import { Product } from "@/entities/product/model/product";

/* The review form's fields. */
export type ValuesWriteReviewFormType = {
  name: string;
  email: string;
  rating: number;
  message: string;
};

type WriteReviewFormProps = {
  /* Records whether the last submit failed. */
  setIsError: Dispatch<SetStateAction<boolean>>;
  /* Shows the result pop-up. */
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  /* Closes the review modal after a successful submit. */
  setIsWriteReviewModalShown: Dispatch<SetStateAction<boolean>>;
  /* The book on this page. */
  currentProduct: Product;
  /* Shows or hides it. */
  setIsPopUpShown?: Dispatch<SetStateAction<boolean>>;
  /* Extra classes for the root element. */
  className?: string;
};

/**
 * Name, email, rating and text, sent with the book's id to the operations
 * group through POST /api/telegram.
 */
export default function WriteReviewForm({
  setIsError,
  setIsWriteReviewModalShown,
  currentProduct,
  setIsNotificationShown,
  className = "",
}: WriteReviewFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    name: "",
    email: "",
    rating: 0,
    message: "",
  };

  const validationSchema = writeReviewValidation();

  const submitForm = async (
    values: ValuesWriteReviewFormType,
    formikHelpers: FormikHelpers<ValuesWriteReviewFormType>
  ) => {
    const { resetForm } = formikHelpers;
    const data = { kind: "review", productId: currentProduct.id, ...values };
    try {
      setIsError(false);
      setIsLoading(true);

      await postJson("/api/telegram", data);
      setIsWriteReviewModalShown(false);
      resetForm();
      setIsNotificationShown(true);
    } catch (error) {
      setIsError(true);
      setIsNotificationShown(true);
      return error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={submitForm}
      validationSchema={validationSchema}
    >
      {({ errors, touched, dirty, isValid }) => (
        <Form className={`${className}`}>
          <div className="flex flex-col w-full gap-y-5 mb-5">
            <p>
              Нам важлива твоя думка! Поділись враженням про покупку — це
              допоможе іншим читачам зробити вибір.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <FormInput
                fieldName="name"
                placeholder={"Ім'я"}
                isRequired
                errors={errors}
                touched={touched}
              />
              <FormInput
                fieldName="email"
                inputType="email"
                placeholder={"Email"}
                isRequired
                errors={errors}
                touched={touched}
              />
            </div>
            <RatingField />
            <FormInput
              fieldName="message"
              as="textarea"
              placeholder={
                "Напиши, що тобі сподобалося або не сподобалося. Будемо вдячні за щирий відгук!"
              }
              isRequired
              errors={errors}
              touched={touched}
              fieldClassName="h-[293px] md:h-[166px] py-4 rounded-[12px]"
            />
          </div>
          <MainButton
            type="submit"
            disabled={!(dirty && isValid) || isLoading}
            isLoading={isLoading}
            loadingText="Надсилання..."
            className="h-[45px]"
          >
            Надіслати відгук
          </MainButton>
        </Form>
      )}
    </Formik>
  );
}

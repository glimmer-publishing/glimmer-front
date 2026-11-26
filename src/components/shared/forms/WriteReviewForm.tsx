"use client";
import { Form, Formik, FormikHelpers } from "formik";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";

import { writeReviewValidation } from "@/schemas/writeReviewValidation";

import CustomizedInput from "@/shared/ui/form/CustomizedInput";
import MainButton from "../buttons/MainButton";
import RatingField from "../formComponents/RatingField";
import { Product } from "@/types/product";

export interface ValuesWriteReviewFormType {
  name: string;
  email: string;
  rating: number;
  message: string;
}

interface WriteReviewFormProps {
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  setIsWriteReviewModalShown: Dispatch<SetStateAction<boolean>>;
  currentProduct: Product;
  setIsPopUpShown?: Dispatch<SetStateAction<boolean>>;
  className?: string;
}

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

      await axios({
        method: "post",
        url: "/api/telegram",
        data,
        headers: {
          "Content-Type": "application/json",
        },
      });
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
              <CustomizedInput
                fieldName="name"
                placeholder={"Ім'я"}
                isRequired
                errors={errors}
                touched={touched}
              />
              <CustomizedInput
                fieldName="email"
                inputType="email"
                placeholder={"Email"}
                isRequired
                errors={errors}
                touched={touched}
              />
            </div>
            <RatingField />
            <CustomizedInput
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

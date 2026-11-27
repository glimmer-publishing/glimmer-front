"use client";
import { Form, Formik, FormikHelpers } from "formik";
import { postJson } from "@/shared/api/http/fetchJson";
import { Dispatch, SetStateAction, useState } from "react";

import { callbackSchema, type CallbackFormValues } from "../model/schema";

import FormInput from "@/shared/ui/form/FormInput";
import MainButton from "@/shared/ui/main-button/MainButton";

type CallbackFormProps = {
  /* Records whether the last submit failed. */
  setIsError: Dispatch<SetStateAction<boolean>>;
  /* Shows the result pop-up. */
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  /* Shows or hides it. */
  setIsPopUpShown?: Dispatch<SetStateAction<boolean>>;
  /* Extra classes for the root element. */
  className?: string;
};

/**
 * Name, email and question, sent to the operations group through POST
 * /api/telegram.
 */
export default function CallbackForm({
  setIsError,
  setIsNotificationShown,
  className = "",
}: CallbackFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    name: "",
    email: "",
    message: "",
  };

  const submitForm = async (
    values: CallbackFormValues,
    formikHelpers: FormikHelpers<CallbackFormValues>
  ) => {
    const { resetForm } = formikHelpers;
    const data = { kind: "callback", ...values };
    try {
      setIsError(false);
      setIsLoading(true);

      await postJson("/api/telegram", data);
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
      validationSchema={callbackSchema}
    >
      {({ errors, touched, dirty, isValid }) => (
        <Form className={`${className}`}>
          <div className="flex flex-col w-full gap-y-5 mb-5">
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
            <FormInput
              fieldName="message"
              as="textarea"
              placeholder={"Повідомлення"}
              isRequired
              errors={errors}
              touched={touched}
              fieldClassName="h-[120px] md:h-[168px] py-4 rounded-[12px]"
            />
          </div>
          <MainButton
            type="submit"
            disabled={!(dirty && isValid) || isLoading}
            isLoading={isLoading}
            loadingText="Надсилання..."
            className="h-[45px]"
          >
            Надіслати питання
          </MainButton>
        </Form>
      )}
    </Formik>
  );
}

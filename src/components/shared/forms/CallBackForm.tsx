"use client";
import { Form, Formik, FormikHelpers } from "formik";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";

import { callBackValidation } from "@/schemas/callBackValidation";

import CustomizedInput from "../formComponents/CustomizedInput";
import MainButton from "../buttons/MainButton";

export interface ValuesCallBackFormType {
  name: string;
  email: string;
  message: string;
}

interface CallBackFormProps {
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  setIsPopUpShown?: Dispatch<SetStateAction<boolean>>;
  className?: string;
}

export default function CallBackForm({
  setIsError,
  setIsNotificationShown,
  className = "",
}: CallBackFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    name: "",
    email: "",
    message: "",
  };

  const validationSchema = callBackValidation();

  const submitForm = async (
    values: ValuesCallBackFormType,
    formikHelpers: FormikHelpers<ValuesCallBackFormType>
  ) => {
    const { resetForm } = formikHelpers;
    const data =
      `<b>Заявка "Форма зворотнього зв'язку"</b>\n` +
      `<b>Ім'я:</b> ${values.name.trim()}\n` +
      `<b>Email:</b> ${values.email.trim()}\n` +
      `<b>Повідомлення:</b> ${values.message.trim()}\n`;
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
            <CustomizedInput
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

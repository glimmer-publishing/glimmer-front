import FormInput from "@/shared/ui/form/FormInput";
import { useFormikContext } from "formik";
import MaskedInput from "react-text-mask";
import { phoneMask } from "@/shared/lib/text/regex";

/* The contact fields, as Formik holds them. */
type Values = {
  [fieldName: string]: string;
};

/**
 * Name, surname, masked phone and email fields of the checkout form.
 */
export default function CheckoutContacts() {
  const { errors, touched } = useFormikContext<Values>();

  return (
    <div className="flex flex-col gap-y-4">
      <FormInput
        fieldName="name"
        placeholder={"Ім'я"}
        isRequired
        errors={errors}
        touched={touched}
      />
      <FormInput
        fieldName="surname"
        placeholder={"Прізвище"}
        isRequired
        errors={errors}
        touched={touched}
      />
      <FormInput
        fieldName="phone"
        inputType="tel"
        placeholder={"Номер телефону"}
        isRequired
        errors={errors}
        touched={touched}
        as={MaskedInput}
        mask={phoneMask}
      />
      <FormInput
        fieldName="email"
        inputType="email"
        placeholder={"Електронна пошта"}
        isRequired
        errors={errors}
        touched={touched}
      />
    </div>
  );
}

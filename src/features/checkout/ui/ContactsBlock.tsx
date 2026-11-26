import CustomizedInput from "@/shared/ui/form/CustomizedInput";
import { useFormikContext } from "formik";
import MaskedInput from "react-text-mask";
import { phoneMask } from "@/regex/regex";

interface Values {
  [fieldName: string]: string;
}

/**
 * Name, surname, masked phone and email fields of the checkout form.
 */
export default function ContactsBlock() {
  const { errors, touched } = useFormikContext<Values>();

  return (
    <div className="flex flex-col gap-y-4">
      <CustomizedInput
        fieldName="name"
        placeholder={"Ім'я"}
        isRequired
        errors={errors}
        touched={touched}
      />
      <CustomizedInput
        fieldName="surname"
        placeholder={"Прізвище"}
        isRequired
        errors={errors}
        touched={touched}
      />
      <CustomizedInput
        fieldName="phone"
        inputType="tel"
        placeholder={"Номер телефону"}
        isRequired
        errors={errors}
        touched={touched}
        as={MaskedInput}
        mask={phoneMask}
      />
      <CustomizedInput
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

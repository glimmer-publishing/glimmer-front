import { useFormikContext } from "formik";
import { useEffect } from "react";
import RadioButtonInput from "../../formComponents/RadioButtonInput";

export default function PaymentBlock() {
  const { values, setFieldValue } = useFormikContext<{
    deliveryService: string;
    payment: string;
  }>();

  useEffect(() => {
    if (values.deliveryService === "Укрпошта") {
      setFieldValue("payment", "Оплата картою онлайн Visa, Mastercard");
    }
  }, [values.deliveryService, setFieldValue]);

  return (
    <div className="flex flex-col gap-4">
      <RadioButtonInput
        fieldName="payment"
        label={"Оплата картою онлайн Visa, Mastercard"}
        value="Оплата картою онлайн Visa, Mastercard"
      />
      <RadioButtonInput
        fieldName="payment"
        label={"Оплата картою Національний кешбек, єКнига"}
        value="Оплата картою Національний кешбек, єКнига"
      />
      {values.deliveryService === "Укрпошта" ? null : (
        <RadioButtonInput
          fieldName="payment"
          label={"Оплата під час отримання товару"}
          value="Оплата під час отримання товару"
        />
      )}
    </div>
  );
}

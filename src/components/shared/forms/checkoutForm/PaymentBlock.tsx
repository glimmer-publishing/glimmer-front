import { useFormikContext } from "formik";
import { useEffect } from "react";
import RadioButtonInput from "../../formComponents/RadioButtonInput";
import { useCartStore } from "@/store/cartStore";
import { PaymentOption } from "@/constants/enums";

export default function PaymentBlock() {
  const { cart } = useCartStore();

  const hasPreorderProducts = cart.some(item => item.product.status === "preOrder");

  const isNationalCashbackAvailable =
    cart.length > 0 &&
    cart.every((item) => item.product.isNationalCashback === true);

  const { values, setFieldValue } = useFormikContext<{
    deliveryService: string;
    payment: string;
  }>();
  

  useEffect(() => {
    if (values.deliveryService === "Укрпошта") {
      setFieldValue("payment", "Оплата картою онлайн Visa, Mastercard");
    }
  }, [values.deliveryService, setFieldValue]);

  useEffect(() => {
    if (values.payment === PaymentOption.HUTKO && !isNationalCashbackAvailable) {
      setFieldValue("payment", "Оплата картою онлайн Visa, Mastercard");
    }
  }, [isNationalCashbackAvailable, values.payment, setFieldValue]);

  return (
    <div className="flex flex-col gap-4">
      <RadioButtonInput
        fieldName="payment"
        label={"Оплата картою онлайн Visa, Mastercard"}
        value="Оплата картою онлайн Visa, Mastercard"
      />
      {isNationalCashbackAvailable && (
        <RadioButtonInput
          fieldName="payment"
          label={PaymentOption.HUTKO}
          value={PaymentOption.HUTKO}
        />
      )}
      <RadioButtonInput
        fieldName="payment"
        label={"Оплата програмою «єКнига» (Дія.Картка)"}
        value="Оплата програмою «єКнига» (Дія.Картка)"
      />
      {(values.deliveryService === "Укрпошта" || hasPreorderProducts) ? null : (
        <RadioButtonInput
          fieldName="payment"
          label={"Оплата під час отримання товару"}
          value="Оплата під час отримання товару"
        />
      )}
    </div>
  );
}

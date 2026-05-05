import { useFormikContext } from "formik";
import { useEffect } from "react";
import RadioButtonInput from "../../formComponents/RadioButtonInput";
import { useCartStore } from "@/store/cartStore";

export default function PaymentBlock() {
  const { cart } = useCartStore();

  const hasPreorderProducts = cart.some(item => item.product.status === "preOrder");

  const { values, setFieldValue } = useFormikContext<{
    deliveryService: string;
    payment: string;
  }>();

  useEffect(() => {
    if (
      values.deliveryService === "Укрпошта" ||
      values.deliveryService === "Міжнародна доставка"
    ) {
      setFieldValue("payment", "Оплата картою онлайн Visa, Mastercard");
    }
  }, [values.deliveryService, setFieldValue]);

  const hideCashOnDelivery =
    values.deliveryService === "Укрпошта" ||
    values.deliveryService === "Міжнародна доставка" ||
    hasPreorderProducts;

  return (
    <div className="flex flex-col gap-4">
      <RadioButtonInput
        fieldName="payment"
        label={"Оплата картою онлайн Visa, Mastercard"}
        value="Оплата картою онлайн Visa, Mastercard"
      />
      <RadioButtonInput
        fieldName="payment"
        label={"Оплата програмою «єКнига» (Дія.Картка)"}
        value="Оплата програмою «єКнига» (Дія.Картка)"
      />
      {hideCashOnDelivery ? null : (
        <RadioButtonInput
          fieldName="payment"
          label={"Оплата під час отримання товару"}
          value="Оплата під час отримання товару"
        />
      )}
    </div>
  );
}

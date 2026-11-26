"use client";

import { useState } from "react";
import Backdrop from "@/shared/ui/backdrop/Backdrop";
import NotificationPopUp from "@/shared/ui/notification-pop-up/NotificationPopUp";
import CheckoutForm, { type CheckoutNotice } from "./CheckoutForm";

const noticeText = (notice: CheckoutNotice) => {
  switch (notice.kind) {
    case "priceChanged":
      return {
        title: "Переглянь твій кошик",
        description:
          "Ціни, знижки або наявність товарів змінились. Ми оновили кошик - перевір суму та підтверди замовлення ще раз.",
      };
    case "paymentFailed":
      return {
        title: "Не вдалося перейти до оплати",
        description: `Замовлення №${notice.orderNumber} створене, але оплату онлайн не вдалося розпочати. Кошик збережено - спробуй ще раз або зателефонуй нам, і ми допоможемо.`,
      };
    default:
      return {
        title: "На жаль, щось пішло не так",
        description: "Спробуй відправити форму ще раз або зателефонуй нам.",
      };
  }
};

/**
 * The checkout form with the pop-up that explains why an order was not
 * placed or not paid.
 */
export default function CheckoutWithNotifications() {
  const [notice, setNotice] = useState<CheckoutNotice | null>(null);
  const [isShown, setIsShown] = useState(false);

  const content = notice && noticeText(notice);

  return (
    <>
      <CheckoutForm
        onNotice={(next) => {
          setNotice(next);
          setIsShown(true);
        }}
      />

      <NotificationPopUp
        headerTitle="Помилка"
        title={content?.title ?? ""}
        description={content?.description ?? ""}
        isPopUpShown={isShown}
        setIsPopUpShown={setIsShown}
      />
      <Backdrop isVisible={isShown} onClick={() => setIsShown(false)} />
    </>
  );
}

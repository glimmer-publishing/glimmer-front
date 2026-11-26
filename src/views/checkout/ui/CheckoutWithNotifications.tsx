"use client";

import { useState } from "react";
import Backdrop from "@/shared/ui/backdrop/Backdrop";
import NotificationPopUp from "@/shared/ui/notification-pop-up/NotificationPopUp";
import CheckoutForm from "@/features/checkout/ui/CheckoutForm";
import type { CheckoutNotice } from "@/features/checkout/model/types";
import CartList from "@/widgets/cart/ui/CartList";
import CartTotal from "@/widgets/cart/ui/CartTotal";

/* The pop-up's title and text for each reason an order did not go through. */
const noticeText = (notice: CheckoutNotice) => {
  switch (notice.kind) {
    case "priceChanged":
      return {
        title: "Переглянь твій кошик",
        description: notice.removedTitles.length
          ? `Ці товари більше недоступні, тому ми прибрали їх з кошика: ${notice.removedTitles.join(", ")}. Перевір суму та підтверди замовлення ще раз.`
          : "Ціни, знижки або наявність товарів змінились. Ми оновили кошик - перевір суму та підтверди замовлення ще раз.",
      };
    case "paymentFailed":
      return {
        title: "Не вдалося перейти до оплати",
        description: `Замовлення №${notice.orderNumber} збережене, але оплату онлайн не вдалося розпочати. Ми зв'яжемося з тобою найближчим часом, щоб завершити оплату. Повторно оформлювати замовлення не потрібно.`,
      };
    default:
      return {
        title: "На жаль, щось пішло не так",
        description: "Спробуй відправити форму ще раз або зателефонуй нам.",
      };
  }
};

/**
 * The checkout form, given the cart's lines and totals, with the pop-up that
 * explains why an order was not placed or not paid.
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
        cartList={
          <CartList
            variant="checkout"
            className="max-h-[201px] lg:max-h-[234px]"
          />
        }
        renderTotal={(submit) => (
          <CartTotal variant="checkout" action={submit} />
        )}
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

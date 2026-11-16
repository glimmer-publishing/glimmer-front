"use client";

import { useState } from "react";
import NotificationPopUp from "../shared/pop-ups/NotitficationPopUp";
import Backdrop from "../shared/backdrop/Backdrop";
import CheckoutForm from "../shared/forms/checkoutForm/CheckoutForm";

interface CheckoutFormWithNotificationsProps {
  className?: string;
}

export default function CheckoutFormWithNotifications({
  className,
}: CheckoutFormWithNotificationsProps) {
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isNotificationShown, setIsNotificationShown] = useState(false);

  return (
    <>
      <CheckoutForm
        setIsError={setIsError}
        setIsUnavailable={setIsUnavailable}
        setIsNotificationShown={setIsNotificationShown}
        className={className}
      />

      <NotificationPopUp
        headerTitle="Помилка"
        title={
          isUnavailable ? "Переглянь твій кошик" : "На жаль, щось пішло не так"
        }
        description={
          isUnavailable
            ? "На жаль, деякі обрані вами позиції недоступні"
            : "Спробуй відправити форму ще раз або зателефонуй нам."
        }
        isPopUpShown={isNotificationShown}
        setIsPopUpShown={setIsNotificationShown}
      />
      <Backdrop
        isVisible={isNotificationShown}
        onClick={() => setIsNotificationShown(false)}
      />
    </>
  );
}

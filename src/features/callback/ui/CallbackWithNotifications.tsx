"use client";

import { useState } from "react";
import CallbackForm from "./CallbackForm";
import NotificationPopUp from "@/shared/ui/notification-pop-up/NotificationPopUp";
import Backdrop from "@/shared/ui/backdrop/Backdrop";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/shared/lib/animation/animationVariants";

type CallbackWithNotificationsProps = {
  /* Extra classes for the root element. */
  className?: string;
};

/**
 * The callback form with the pop-up that says whether the question was sent.
 */
export default function CallbackWithNotifications({
  className,
}: CallbackWithNotificationsProps) {
  const [isError, setIsError] = useState(false);
  const [isNotificationShown, setIsNotificationShown] = useState(false);

  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInAnimation({ y: 20, delay: 0.4 })}
      >
        <CallbackForm
          setIsError={setIsError}
          setIsNotificationShown={setIsNotificationShown}
          className={className}
        />
      </motion.div>
      <NotificationPopUp
        headerTitle={isError ? "Помилка" : "Успіх"}
        title={isError ? "На жаль, щось пішло не так" : "Дякуємо за звернення!"}
        description={
          isError
            ? "Спробуй відправити форму ще раз"
            : "Наш менеджер скоро зв'яжеться з вами"
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

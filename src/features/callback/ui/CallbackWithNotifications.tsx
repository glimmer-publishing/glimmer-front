"use client";

import { useState } from "react";
import CallBackForm from "./CallBackForm";
import NotificationPopUp from "@/shared/ui/notification-pop-up/NotificationPopUp";
import Backdrop from "@/shared/ui/backdrop/Backdrop";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/shared/lib/animationVariants";

interface CallbackWithNotificationsProps {
  className?: string;
}

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
        <CallBackForm
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

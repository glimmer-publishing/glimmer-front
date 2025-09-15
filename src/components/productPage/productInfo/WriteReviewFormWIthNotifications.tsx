"use client";

import { useState, Dispatch, SetStateAction } from "react";
import WriteReviewForm from "@/components/shared/forms/WriteReviewForm";
import NotificationPopUp from "@/components/shared/pop-ups/NotitficationPopUp";
import Backdrop from "@/components/shared/backdrop/Backdrop";
import Modal from "@/components/shared/modals/Modal";
import { Product } from "@/types/product";

interface WriteReviewFormWithNotificationsProps {
  isWriteReviewModalShown: boolean;
  setIsWriteReviewModalShown: Dispatch<SetStateAction<boolean>>;
  currentProduct: Product;
  className?: string;
}

export default function WriteReviewFormWithNotifications({
  isWriteReviewModalShown,
  setIsWriteReviewModalShown,
  currentProduct,
  className,
}: WriteReviewFormWithNotificationsProps) {
  const [isError, setIsError] = useState(false);
  const [isNotificationShown, setIsNotificationShown] = useState(false);

  return (
    <>
      <Modal
        isPopUpShown={isWriteReviewModalShown}
        setIsPopUpShown={setIsWriteReviewModalShown}
        headerTitle="Залишити відгук про товар"
      >
        <div className="pt-4">
          <WriteReviewForm
            setIsError={setIsError}
            setIsNotificationShown={setIsNotificationShown}
            setIsWriteReviewModalShown={setIsWriteReviewModalShown}
            currentProduct={currentProduct}
            className={className}
          />
        </div>
      </Modal>
      <Backdrop
        isVisible={isNotificationShown || isWriteReviewModalShown}
        onClick={() => {
          setIsNotificationShown(false);
          setIsWriteReviewModalShown(false);
        }}
      />
      <NotificationPopUp
        headerTitle={isError ? "Помилка" : "Успіх"}
        title={
          isError ? "На жаль, щось пішло не так" : "Дякуємо за ваш відгук!"
        }
        description={
          isError
            ? "Спробуй відправити форму ще раз"
            : "Після модерації він з’явиться на сторінці товару."
        }
        isPopUpShown={isNotificationShown}
        setIsPopUpShown={setIsNotificationShown}
      />
    </>
  );
}

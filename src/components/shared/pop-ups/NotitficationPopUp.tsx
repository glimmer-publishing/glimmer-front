import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import Modal from "../modals/Modal";
import MainButton from "../buttons/MainButton";

interface NotificationPopUpProps {
  headerTitle: string;
  title: string;
  description: string;
  isPopUpShown: boolean;

  setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
}

export default function NotificationPopUp({
  headerTitle,
  title,
  description,
  isPopUpShown,

  setIsPopUpShown,
}: NotificationPopUpProps) {
  return (
    <Modal
      isPopUpShown={isPopUpShown}
      setIsPopUpShown={setIsPopUpShown}
      headerTitle={headerTitle}
    >
      <Image
        src="/images/notifications/starsTop.svg"
        alt="stars"
        width="85"
        height="144"
        className="absolute top-0 left-0 md:hidden"
      />

      <Image
        src="/images/notifications/starsTopDesk.svg"
        alt="stars"
        width="82"
        height="197"
        className="absolute top-3 left-0 hidden md:block"
      />
      <Image
        src="/images/notifications/starsBottom.svg"
        alt="stars"
        width="91"
        height="92"
        className="absolute bottom-0 right-0"
      />
      <div className="md:pt-10 relative flex flex-col justify-center items-center w-full h-[calc(100%-41px)]">
        <h3 className="mb-8 lg:mb-10 text-[24px] lg:text-[32px] font-semibold leading-[120%] text-center text-main uppercase">
          {title}
        </h3>
        <p className="mb-10 md:mb-14 text-center">{description}</p>
        <MainButton
          onClick={() => setIsPopUpShown(false)}
          className="h-[45px] w-[199px] md:w-[291px] mx-auto"
        >
          Повернутись
        </MainButton>
      </div>
    </Modal>
  );
}

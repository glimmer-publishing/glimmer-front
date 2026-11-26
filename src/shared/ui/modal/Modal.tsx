import { Dispatch, ReactNode, SetStateAction } from "react";

import IconButton from "@/shared/ui/icon-button/IconButton";
import CrossIcon from "@/shared/ui/icons/CrossIcon";

type ModalProps = {
  /* Whether it is shown. */
  isPopUpShown: boolean;
  /* Text in the modal's header bar. */
  headerTitle: string;
  /* Shows or hides it. */
  setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
  /* The modal's body. */
  children: ReactNode;
  /* Extra classes for the root element. */
  className?: string;
};

/**
 * A centered modal with a close button, shown and hidden by its parent.
 */
export default function Modal({
  isPopUpShown,
  headerTitle,
  setIsPopUpShown,
  children,
  className = "",
}: ModalProps) {
  return (
    <div
      className={`${
        isPopUpShown
          ? " -translate-y-[calc(50dvh-50%)] opacity-100 scale-100"
          : "pointer-events-none opacity-0 scale-90"
      } fixed left-0 md:left-1/2 bottom-0 transform md:-translate-x-1/2 transition duration-[600ms] ease-out z-[70] w-dvw h-dvh md:w-[640px] md:h-auto max-h-dvh
      px-5 md:px-6 py-4 md:py-8 overflow-y-auto bg-white md:rounded-[12px] scrollbar scrollbar-w-[3px] scrollbar-thumb-rounded-full 
      scrollbar-track-rounded-full scrollbar-thumb-transparent scrollbar-track-main popup-scroll ${className}`}
    >
      <div className="flex justify-between items-center pb-4 border-b border-black/10">
        <h3 className="text-[14px] lg:text-[18px] font-medium leading-[120%]">
          {headerTitle}
        </h3>
        <IconButton
          handleClick={() => setIsPopUpShown(false)}
          className="size-6"
        >
          {<CrossIcon />}
        </IconButton>
      </div>
      {children}
    </div>
  );
}

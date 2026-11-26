import { ReactNode } from "react";
import Image from "next/image";
import * as motion from "motion/react-client";
import { listItemVariants } from "@/shared/lib/animation/animationVariants";

type ContactsItemProps = {
  /* What this contact is for. */
  title: string;
  /* Its links or text. */
  description: ReactNode;
  /* Extra classes for the root element. */
  className?: string;
};

/**
 * One contact: a title and its links (phone, email, Telegram).
 */
export default function ContactsItem({
  title,
  description,
  className = "",
}: ContactsItemProps) {
  return (
    <motion.div
      viewport={{ once: true, amount: 0.2 }}
      variants={listItemVariants}
      className={`p-2 lg:p-3 rounded-[12px] shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)] ${className}`}
    >
      <div className="flex justify-between mb-4 lg:mb-6">
        <h3>{title}</h3>
        <Image
          src="/images/contactsPage/contactsInfo/arrow.svg"
          alt="arrow icon"
          width={24}
          height={24}
          className="shrink-0"
        />
      </div>
      <div className="text-[12px] xs:text-[14px] lg:text-[18px] font-medium leading-[120%]">
        {description}
      </div>
    </motion.div>
  );
}

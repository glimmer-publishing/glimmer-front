import { ReactNode } from "react";
import Image from "next/image";
import * as motion from "motion/react-client";
import { listItemVariants } from "@/utils/animationVariants";

interface ContactItemProps {
  title: string;
  description: ReactNode;
  className?: string;
}

export default function ContactItem({
  title,
  description,
  className = "",
}: ContactItemProps) {
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

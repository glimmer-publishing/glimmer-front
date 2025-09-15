import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";

interface PublicContractBlockProps {
  title: string;
  list: string[];
}

export default function PublicContractBlock({
  title,
  list,
}: PublicContractBlockProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInAnimation({ y: 30 })}
    >
      <h3 className="mb-2 xl:mb-3 text-[16px] xl:text-[20px] font-semibold leading-[160%] uppercase">
        {title}
      </h3>
      <ul className="flex flex-col gap-2">
        {list.map((listItem, idx) => (
          <li
            key={idx}
            className="text-[14px] xl:text-[16px] font-normal leading-[160%]"
          >
            {listItem}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

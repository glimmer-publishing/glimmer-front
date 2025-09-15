"use client";

import { useState } from "react";
import MainButton from "@/components/shared/buttons/MainButton";
import WriteReviewFormWithNotifications from "./WriteReviewFormWIthNotifications";
import { Product } from "@/types/product";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";

interface WriteReviewProps {
  currentProduct: Product;
}

export default function WriteReview({ currentProduct }: WriteReviewProps) {
  const [isWriteReviewModalShown, setIsWriteReviewModalShown] = useState(false);

  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInAnimation({ y: 20, delay: 0.2 })}
      >
        <MainButton
          onClick={() => setIsWriteReviewModalShown(true)}
          className="h-[45px]"
        >
          Написати відгук
        </MainButton>
      </motion.div>
      <WriteReviewFormWithNotifications
        currentProduct={currentProduct}
        isWriteReviewModalShown={isWriteReviewModalShown}
        setIsWriteReviewModalShown={setIsWriteReviewModalShown}
      />
    </>
  );
}

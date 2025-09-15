import { Product } from "@/types/product";
import { Rating } from "react-simple-star-rating";
import { getAverageRating } from "@/utils/getAverageRating";
import StarEmptyIcon from "@/components/shared/icons/StarEmptyIcon";
import StarFilledIcon from "@/components/shared/icons/StarFilledIcon";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";

interface ProductDetailsProps {
  currentProduct: Product;
}

export default function ProductDetails({
  currentProduct,
}: ProductDetailsProps) {
  const { title, author, status, sku, reviews } = currentProduct;

  const rating = getAverageRating(reviews);

  function getReviewWord(count: number) {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return "відгуків";
    }

    if (lastDigit === 1) {
      return "відгук";
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return "відгуки";
    }

    return "відгуків";
  }

  return (
    <div className="py-4 lg:pt-0 lg:pb-6">
      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInAnimation({ x: 30 })}
        className="mb-4 lg:mb-6"
      >
        <h1 className="mb-2 text-[20px] lg:text-[32px] font-semibold leading-[120%]">
          {title}
        </h1>
        {author ? (
          <p className="text-[14px] lg:text-[18px] font-light leading-[120%]">
            {author}
          </p>
        ) : null}
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInAnimation({ y: 20 })}
        className="flex justify-between"
      >
        <div className="flex flex-col gap-2 min-h-full justify-between">
          <p
            className={`text-[12px] lg:text-[15px] font-medium leading-[120%] text-main `}
          >
            {status === "inStock" ? "В наявності" : "Передзамовлення"}
          </p>
          <p>Код товару: {sku}</p>
        </div>
        <div>
          <Rating
            initialValue={rating}
            allowFraction
            readonly
            className="mb-2"
            emptyIcon={
              <StarEmptyIcon className="inline-block mx-0.5 w-4 lg:w-6 h-auto" />
            }
            fillIcon={
              <StarFilledIcon className="inline mx-0.5 w-4 lg:w-6 h-auto" />
            }
          />
          <p className="text-right">
            ({reviews?.length ? reviews?.length : 0}{" "}
            {getReviewWord(reviews?.length)})
          </p>
        </div>
      </motion.div>
    </div>
  );
}

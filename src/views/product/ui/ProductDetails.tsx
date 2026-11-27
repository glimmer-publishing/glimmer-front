import { Product } from "@/entities/product/model/product";
import { Rating } from "react-simple-star-rating";
import { getAverageRating } from "@/entities/product/lib/getAverageRating";
import StarEmptyIcon from "@/shared/ui/icons/StarEmptyIcon";
import StarFilledIcon from "@/shared/ui/icons/StarFilledIcon";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/shared/lib/animation/animationVariants";
import Link from "next/link";
import { pluralizeUk, type UkPluralForms } from "@/shared/lib/text/pluralizeUk";
import {
  getSeriesHref,
  getSeriesInfo,
} from "@/entities/product/lib/getSeriesInfo";

/* "відгук" in the form that agrees with the review count. */
const REVIEW_FORMS: UkPluralForms = ["відгук", "відгуки", "відгуків"];

type ProductDetailsProps = {
  /* The book on this page. */
  currentProduct: Product;
};

/**
 * Title, author, rating with the review count, series, availability and code.
 */
export default function ProductDetails({
  currentProduct,
}: ProductDetailsProps) {
  const { title, author, status, sku, reviews, features } = currentProduct;

  const rating = getAverageRating(reviews);
  const series = getSeriesInfo(features);

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
        {author ||
          (series && (
            /**
             * Author on the left, series on the right of the same line. Each
             * wraps within its own side rather than pushing the other off.
             */
            <div className="flex items-baseline justify-between gap-4">
              {author && (
                <Link
                  href={`/author/${encodeURIComponent(author)}`}
                  aria-label={`Переглянути всі книги автора ${author}`}
                  className="min-w-0 text-[14px] lg:text-[18px] font-light leading-[120%] transition duration-300 ease-out xl:hover:text-main focus-visible:text-main active:text-main outline-none"
                >
                  {author}
                </Link>
              )}
              {series && (
                <Link
                  href={getSeriesHref(series.name)}
                  className="ml-auto max-w-[50%] text-right break-words text-[12px] lg:text-[15px] font-light leading-[120%] transition duration-300 ease-out xl:hover:text-main focus-visible:text-main active:text-main outline-none"
                >
                  Серія «{series.name}»
                </Link>
              )}
            </div>
          ))}
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
            {pluralizeUk(reviews?.length ?? 0, REVIEW_FORMS)})
          </p>
        </div>
      </motion.div>
    </div>
  );
}

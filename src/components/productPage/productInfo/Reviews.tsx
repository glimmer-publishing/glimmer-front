import { useState, useRef, useEffect } from "react";
import MainButton from "@/components/shared/buttons/MainButton";
import { Review } from "@/types/review";
import { Rating } from "react-simple-star-rating";
import StarEmptyIcon from "@/components/shared/icons/StarEmptyIcon";
import StarFilledIcon from "@/components/shared/icons/StarFilledIcon";
import WriteReview from "./WriteReview";
import { Product } from "@/types/product";
import * as motion from "motion/react-client";
import { formatDate } from "@/utils/formatDate";
import {
  fadeInAnimation,
  listVariants,
  listItemVariants,
} from "@/utils/animationVariants";

interface ReviewsProps {
  reviews: Review[];
  currentProduct: Product;
}

export default function Reviews({ reviews, currentProduct }: ReviewsProps) {
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  useEffect(() => {
    if (!containerRef.current) return;

    if (showAll) {
      setMaxHeight(`${containerRef.current.scrollHeight}px`);
    } else {
      setMaxHeight("0px");
    }
  }, [showAll, reviews]);

  const firstTwoReviews = reviews?.slice(0, 2);
  const extraReviews = reviews?.slice(2);

  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInAnimation({})}
        className="w-full h-[1px] bg-black/60"
      />
      <div className="py-4 lg:py-6">
        <motion.h3
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInAnimation({ y: 20 })}
          className="mb-4 text-[14px] lg:text-[18px] font-medium leading-[120%]"
        >
          Відгуки
        </motion.h3>

        {!reviews?.length ? (
          <p className="my-6 text-black/60 text-center">Ще немає відгуків</p>
        ) : (
          <>
            {/* Перші два відгуки */}
            <motion.ul
              initial="hidden"
              whileInView="visible"
              exit="exit"
              viewport={{ once: true, amount: 0.3 }}
              variants={listVariants({
                staggerChildren: 0.2,
                delayChildren: 0.2,
              })}
            >
              {firstTwoReviews?.map(({ author, text, date, rating }, idx) => (
                <motion.li
                  viewport={{ once: true, amount: 0.2 }}
                  variants={listItemVariants}
                  key={idx}
                  className="py-4 not-last:border-b border-black/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <p>{author}</p>
                      <Rating
                        initialValue={rating}
                        allowFraction
                        readonly
                        emptyIcon={
                          <StarEmptyIcon className="inline-block mx-0.5 w-4 lg:w-6 h-auto" />
                        }
                        fillIcon={
                          <StarFilledIcon className="inline mx-0.5 w-4 lg:w-6 h-auto" />
                        }
                      />
                    </div>
                    <p className="text-black/60">{formatDate(date)}</p>
                  </div>
                  {text ? <p>{text}</p> : null}
                </motion.li>
              ))}
            </motion.ul>

            {/* Контейнер для додаткових відгуків з анімацією */}
            <div
              ref={containerRef}
              style={{
                maxHeight: maxHeight,
                overflow: "hidden",
                transition: "max-height 0.5s ease",
              }}
            >
              <ul>
                {extraReviews?.map(({ author, text, date, rating }, idx) => (
                  <li
                    key={idx + 2}
                    className="py-4 not-last:border-b border-black/10"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <p>{author}</p>
                        <Rating
                          initialValue={rating}
                          allowFraction
                          readonly
                          emptyIcon={
                            <StarEmptyIcon className="inline-block mx-0.5 w-4 lg:w-6 h-auto" />
                          }
                          fillIcon={
                            <StarFilledIcon className="inline mx-0.5 w-4 lg:w-6 h-auto" />
                          }
                        />
                      </div>
                      <p className="text-black/60">{formatDate(date)}</p>
                    </div>
                    {text ? <p>{text}</p> : null}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Кнопки */}
        <div className="flex flex-col gap-4 mt-4">
          {reviews?.length > 2 && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              exit="exit"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInAnimation({ y: 20 })}
            >
              <MainButton
                className="h-[45px]"
                variant="bordered"
                onClick={() => setShowAll((prev) => !prev)}
              >
                {showAll
                  ? "Показати менше відгуків"
                  : "Показати більше відгуків"}
              </MainButton>
            </motion.div>
          )}
          <WriteReview currentProduct={currentProduct} />
        </div>
      </div>
    </>
  );
}

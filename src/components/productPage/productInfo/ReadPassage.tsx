"use client";

import { useState, useRef } from "react";
import ImageGallery from "react-image-gallery";
import MainButton from "@/components/shared/buttons/MainButton";
import Modal from "@/components/shared/modals/Modal";
import Backdrop from "@/components/shared/backdrop/Backdrop";
import ArrowIcon from "@/components/shared/icons/ArrowIcon";
import { useScreenWidth } from "@/hooks/useScreenWidth";
import MarqueeLine from "@/components/shared/marquee/MarqueeLine";
import FavoriteButton from "./FavoriteButton";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";
import { sendGTMEvent } from "@next/third-parties/google";

interface ReadPassageProps {
  bookScreens: string[];
  currentProduct: Product;
}

export default function ReadPassage({
  bookScreens,
  currentProduct,
}: ReadPassageProps) {
  const screenWidth = useScreenWidth();
  const isDesktop = screenWidth >= 768;

  const { addToCart } = useCartStore();

  const [isReadPassageModalShown, setIsReadPassageModalShown] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const galleryRef = useRef<ImageGallery | null>(null);

  const galleryItems = bookScreens.map((photo) => ({
    original: photo,
    thumbnail: photo,
    originalAlt: "image",
    thumbnailAlt: "thumbnail",
    thumbnailHeight: 48,
    thumbnailWidth: 48,
    originalClass:
      "rounded-[8px] tabxl:rounded-[12px] overflow-hidden px-[1px]",
    thumbnailClass: "custom-thumbnail",
  }));

  const handleSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInAnimation({ scale: 0.95, delay: 0.4 })}
      >
        <MainButton
          onClick={() => setIsReadPassageModalShown(true)}
          variant="bordered"
          className="h-[45px]"
        >
          Читати уривок
        </MainButton>
      </motion.div>
      <Modal
        headerTitle="Читати уривок"
        isPopUpShown={isReadPassageModalShown}
        setIsPopUpShown={setIsReadPassageModalShown}
      >
        <div className="book-screens w-full max-w-[320px] md:max-w-[580px] mx-auto lg:mx-0 overflow-visible">
          <ImageGallery
            ref={(ref) => {
              galleryRef.current = ref;
            }}
            items={galleryItems}
            showPlayButton={false}
            showFullscreenButton={false}
            showThumbnails={isDesktop}
            useBrowserFullscreen={false}
            showBullets={false}
            slideOnThumbnailOver={true}
            disableThumbnailScroll={false}
            thumbnailPosition="left"
            startIndex={currentIndex}
            onSlide={handleSlide}
            renderLeftNav={(onClick, disabled) => (
              <button
                type="button"
                className="cursor-pointer rotate-90 absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full will-change-transform 
            active:scale-95 active:text-main xl:hover:text-main transition duration-300 ease-in-out"
                onClick={onClick}
                disabled={disabled}
              >
                <ArrowIcon className="size-6 lg:size-10" />
              </button>
            )}
            renderRightNav={(onClick, disabled) => (
              <button
                type="button"
                className="cursor-pointer -rotate-90 absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full will-change-transform 
            active:scale-95 active:text-main xl:hover:text-main transition duration-300 ease-in-out"
                onClick={onClick}
                disabled={disabled}
              >
                <ArrowIcon className="size-6 lg:size-10" />
              </button>
            )}
          />
          <div className="fixed bottom-0 left-0 md:hidden w-full">
            {isReadPassageModalShown && (
              <MarqueeLine className="md:hidden mt-2.5 mb-4" />
            )}
            <div className="flex justify-between gap-4 px-5 w-full my-4">
              <FavoriteButton currentProduct={currentProduct} />
              <MainButton
                onClick={() => {
                  addToCart(currentProduct, 1);
                  sendGTMEvent({ event: "AddToCart" });
                }}
                className="h-[45px] lg:max-w-[180px]"
              >
                Купити
              </MainButton>
            </div>
          </div>
        </div>
      </Modal>
      <Backdrop
        isVisible={isReadPassageModalShown}
        onClick={() => {
          setIsReadPassageModalShown(false);
        }}
      />
    </div>
  );
}

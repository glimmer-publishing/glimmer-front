"use client";

import ImageGallery from "react-image-gallery";
import { useRef, useState } from "react";
import { useScreenWidth } from "@/hooks/useScreenWidth";
import ArrowIcon from "@/components/shared/icons/ArrowIcon";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";

interface ImagePickerProps {
  photos: string[];
}

export default function ImagePicker({ photos }: ImagePickerProps) {
  const screenWidth = useScreenWidth();
  const isDesktop = screenWidth >= 1024;

  const [currentIndex, setCurrentIndex] = useState(0);
  const galleryRef = useRef<ImageGallery | null>(null);

  const galleryItems = photos.map((photo) => ({
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
    <motion.div
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeInAnimation({ scale: 0.95 })}
      className="gallery-container w-full max-w-[320px] md:max-w-[460px] lg:max-w-[617px] xl:max-w-[580px] mx-auto md:mx-0 mb-4"
    >
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
    </motion.div>
  );
}

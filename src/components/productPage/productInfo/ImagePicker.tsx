"use client";

import ImageGallery from "react-image-gallery";
import { useRef, useState } from "react";
import { useScreenWidth } from "@/hooks/useScreenWidth";
import { useImageTap } from "@/hooks/useImageTap";
import ArrowIcon from "@/components/shared/icons/ArrowIcon";
import ImageViewer from "@/components/shared/imageViewer/ImageViewer";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";

interface ImagePickerProps {
  photos: string[];
  productTitle: string;
  /* True while another overlay owns the page - see ProductInfo. */
  isOverlayShown?: boolean;
}

export default function ImagePicker({
  photos,
  productTitle,
  isOverlayShown = false,
}: ImagePickerProps) {
  const screenWidth = useScreenWidth();
  const isDesktop = screenWidth >= 1024;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isViewerShown, setIsViewerShown] = useState(false);
  const galleryRef = useRef<ImageGallery | null>(null);

  const altPrefix = `Обкладинка: ${productTitle}`;
  const imageTapHandlers = useImageTap(() => setIsViewerShown(true));

  const galleryItems = photos.map((photo, index) => ({
    original: photo,
    thumbnail: photo,
    originalAlt: `${altPrefix}, фото ${index + 1}`,
    thumbnailAlt: `${altPrefix}, мініатюра ${index + 1}`,
    thumbnailHeight: 48,
    thumbnailWidth: 48,
    originalClass:
      "rounded-[8px] tabxl:rounded-[12px] overflow-hidden px-[1px] cursor-zoom-in",
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
      <div {...imageTapHandlers}>
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
          disableKeyDown={isOverlayShown || isViewerShown}
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
      </div>
      <ImageViewer
        photos={photos}
        isShown={isViewerShown}
        startIndex={currentIndex}
        onClose={() => setIsViewerShown(false)}
        altPrefix={altPrefix}
      />
    </motion.div>
  );
}

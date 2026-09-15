"use client";

import "swiper/css";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper/types";
import ArrowIcon from "@/components/shared/icons/ArrowIcon";
import CrossIcon from "@/components/shared/icons/CrossIcon";
import IconButton from "@/components/shared/buttons/IconButton";
import { TAP_TOLERANCE_PX } from "@/hooks/useImageTap";

interface ImageViewerProps {
  photos: string[];
  isShown: boolean;
  startIndex: number;
  onClose: () => void;
  /* Used to build the alt text: "<altPrefix>, фото 2" */
  altPrefix: string;
}

export default function ImageViewer({
  photos,
  isShown,
  startIndex,
  onClose,
  altPrefix,
}: ImageViewerProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const [loadedPhotos, setLoadedPhotos] = useState<Record<string, boolean>>({});
  const [failedPhotos, setFailedPhotos] = useState<Record<string, boolean>>({});
  const swiperRef = useRef<SwiperClass | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const pointerDownRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isShown) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isShown, onClose]);

  const hasManyPhotos = photos.length > 1;

  const handlePointerDown = (event: React.PointerEvent) => {
    pointerDownRef.current = { x: event.clientX, y: event.clientY };
  };

  /* Closes only on a genuine tap on the backdrop around the panel - never at
     the end of a swipe, and never on the panel itself. */
  const handlePointerUp = (event: React.PointerEvent) => {
    const pointerDown = pointerDownRef.current;
    pointerDownRef.current = null;

    if (!pointerDown) return;

    const travelled = Math.hypot(
      event.clientX - pointerDown.x,
      event.clientY - pointerDown.y,
    );

    if (travelled > TAP_TOLERANCE_PX) return;
    if (panelRef.current?.contains(event.target as Node)) return;

    onClose();
  };

  if (!isMounted) return null;

  return createPortal(
    <div
      aria-hidden={!isShown}
      inert={!isShown}
      className={`fixed inset-0 z-[110] w-dvw h-dvh flex items-center justify-center bg-black/50 transition-opacity duration-300 ease-out ${
        isShown ? "opacity-100 no-doc-scroll" : "opacity-0 pointer-events-none"
      }`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <div
        ref={panelRef}
        className={`relative flex flex-col w-dvw h-dvh md:w-[96dvw] md:max-w-[1400px] md:h-[95dvh] px-3 md:px-4 py-2 md:py-3 bg-white
        md:rounded-[12px] transition duration-[600ms] ease-out ${
          isShown ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <div className="flex justify-end items-center">
          <IconButton handleClick={onClose} className="relative p-2 shrink-0">
            {<CrossIcon className="size-6" />}
          </IconButton>
        </div>

        <div className="flex-1 min-h-0 py-2">
          {isShown ? (
            <Swiper
              modules={[Keyboard]}
              keyboard={{ enabled: true }}
              initialSlide={startIndex}
              /* Matches the on-page gallery, which wraps around by default. */
              loop={hasManyPhotos}
              allowTouchMove={hasManyPhotos}
              lazyPreloadPrevNext={1}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                setActiveIndex(swiper.realIndex);
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              className="image-viewer-swiper w-full h-full"
            >
              {photos.map((photo, index) => (
                <SwiperSlide key={`${photo}-${index}`}>
                  <img
                    src={photo}
                    alt={`${altPrefix}, фото ${index + 1}`}
                    draggable={false}
                    loading="lazy"
                    onLoad={() =>
                      setLoadedPhotos((previous) => ({
                        ...previous,
                        [photo]: true,
                      }))
                    }
                    onError={() =>
                      setFailedPhotos((previous) => ({
                        ...previous,
                        [photo]: true,
                      }))
                    }
                    className="max-w-full max-h-full object-contain select-none"
                  />
                  {!loadedPhotos[photo] ? (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {failedPhotos[photo] ? (
                        <p className="text-[14px] text-placeholder px-5 text-center">
                          Не вдалося завантажити фото
                        </p>
                      ) : (
                        <div className="loader"></div>
                      )}
                    </div>
                  ) : null}
                </SwiperSlide>
              ))}
            </Swiper>
          ) : null}
        </div>

        {hasManyPhotos ? (
          <div className="flex items-center justify-center gap-6 pt-1 pb-1">
            <button
              type="button"
              aria-label="Попереднє фото"
              onClick={() => swiperRef.current?.slidePrev()}
              className="cursor-pointer rotate-90 p-2 rounded-full will-change-transform
              active:scale-95 active:text-main xl:hover:text-main transition duration-300 ease-in-out"
            >
              <ArrowIcon className="size-7 lg:size-8" />
            </button>
            <span className="text-[14px] lg:text-[16px] tabular-nums select-none">
              {activeIndex + 1} / {photos.length}
            </span>
            <button
              type="button"
              aria-label="Наступне фото"
              onClick={() => swiperRef.current?.slideNext()}
              className="cursor-pointer -rotate-90 p-2 rounded-full will-change-transform
              active:scale-95 active:text-main xl:hover:text-main transition duration-300 ease-in-out"
            >
              <ArrowIcon className="size-7 lg:size-8" />
            </button>
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

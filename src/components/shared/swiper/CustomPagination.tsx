import { Swiper } from "swiper/types";

export const createPagination = (maxVisibleBullets = 4) => ({
  clickable: true,
  type: "custom" as const,
  renderCustom: (swiper: Swiper, current: number, total: number) => {
    let bullets = "";

    let start = Math.max(1, current - Math.floor(maxVisibleBullets / 2));
    let end = start + maxVisibleBullets - 1;

    if (end > total) {
      end = total;
      start = Math.max(1, end - maxVisibleBullets + 1);
    }

    for (let i = 1; i <= total; i++) {
      const isVisible = i >= start && i <= end;

      bullets += `
        <span 
          class="swiper-pagination-bullet cursor-pointer ${
            i === current ? "swiper-pagination-bullet-active" : ""
          } ${!isVisible ? "!hidden" : ""}" 
          data-index="${i - 1}">
          ${i}
        </span>
      `;
    }

    return bullets;
  },
});

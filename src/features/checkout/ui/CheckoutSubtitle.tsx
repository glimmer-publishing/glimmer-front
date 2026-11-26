import { ReactNode } from "react";

interface CheckoutSubtitleProps {
  /* The heading text. */
  children: ReactNode;
}

/**
 * Heading of one checkout section.
 */
export default function CheckoutSubTitle({ children }: CheckoutSubtitleProps) {
  return (
    <h3 className="mb-6 text-[14px] lg:text-[18px] font-medium leading-[120%]">
      {children}
    </h3>
  );
}

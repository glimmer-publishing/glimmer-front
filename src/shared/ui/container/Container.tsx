import { ReactNode } from "react";

type ContainerProps = {
  /* The content. */
  children?: ReactNode;
  /* Extra classes for the root element. */
  className?: string;
};

/**
 * Centers content at the site's responsive max width with side padding.
 */
export default function Container({
  children,
  className = "",
}: ContainerProps) {
  return (
    <div
      className={`xs:max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px] px-5 lg:px-[50px] mx-auto ${className}`}
    >
      {children}
    </div>
  );
}

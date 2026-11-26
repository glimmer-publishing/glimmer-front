import { ReactNode } from "react";

type SectionProps = {
  /* The content. */
  children?: ReactNode;
  /* Extra classes for the root element. */
  className?: string;
};

/**
 * A page <section> with the site's vertical spacing.
 */
export default function Section({ children, className = "" }: SectionProps) {
  return <section className={`py-8 lg:py-10 ${className}`}>{children}</section>;
}

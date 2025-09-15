import { ReactNode } from "react";

interface SectionProps {
  children?: ReactNode;
  className?: string;
}

export default function Section({ children, className = "" }: SectionProps) {
  return <section className={`py-8 lg:py-10 ${className}`}>{children}</section>;
}

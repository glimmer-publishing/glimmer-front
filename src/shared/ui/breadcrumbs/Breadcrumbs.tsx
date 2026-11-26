import Container from "@/shared/ui/container/Container";
import Link from "next/link";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/shared/lib/animation/animationVariants";

/* One link of the trail. */
type Breadcrumb = {
  label: string;
  href: string;
};

type BreadcrumbsProps = {
  /* Trail from the home page to the current page. */
  crumbs: Breadcrumb[];
  /* Extra classes for the root element. */
  className?: string;
};

/**
 * The page's trail of links, the last one being the current page.
 */
export default function Breadcrumbs({
  crumbs,
  className = "",
}: BreadcrumbsProps) {
  return (
    <Container className={className}>
      <motion.nav
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInAnimation({})}
        aria-label="breadcrumbs"
        className={`flex items-center pb-4 lg:pb-8 pt-2 lg:pt-4`}
      >
        <ul className="flex items-center flex-wrap">
          {crumbs.map((crumb, index) => (
            <li
              key={crumb.href}
              className={`flex items-center text-[10px] lg:text-[12px] font-light leading-[120%]`}
            >
              {index === crumbs.length - 1 ? (
                <>
                  <span>{crumb.label}</span>
                </>
              ) : (
                <>
                  <Link
                    href={crumb.href}
                    className="outline-none active:text-main xl:hover:text-main focus-visible:text-main transition duration-300 ease-out"
                  >
                    {crumb.label}
                  </Link>
                  <span className="inline-block mx-2">/</span>
                </>
              )}
            </li>
          ))}
        </ul>
      </motion.nav>
    </Container>
  );
}

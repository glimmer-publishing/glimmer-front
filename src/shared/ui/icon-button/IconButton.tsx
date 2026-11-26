import { ReactNode } from "react";

type IconButtonProps = {
  /* Called on click. */
  handleClick?: () => void;
  /* The icon. */
  children: ReactNode;
  /* Extra classes for the root element. */
  className?: string;
};

/**
 * A round button that holds an icon, with a glow on hover and focus.
 */
export default function IconButton({
  handleClick,
  children,
  className = "",
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label="icon button"
      onClick={handleClick}
      className={`cursor-pointer outline-none before:content-[''] before:absolute before:-z-10 before:top-0 before:left-0 before:rounded-full before:size-full 
                        before:bg-main before:blur-[4px] supports-[backdrop-filter]:before:blur-[4px] will-change-transform before:opacity-0
                         before:transition before:duration-300 before:ease-out active:before:opacity-20 
                        focus-visible:before:opacity-20 lg:hover:before:opacity-20 ${className}`}
    >
      {children}
    </button>
  );
}

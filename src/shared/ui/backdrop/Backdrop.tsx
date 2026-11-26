import { useEffect } from "react";

type BackdropProps = {
  /* Whether the backdrop is shown. */
  isVisible: boolean;
  /* Called on a click outside the modal; usually closes it. */
  onClick: () => void;
  /* Extra classes for the root element. */
  className?: string;
  /* No dimming: the layer only catches outside clicks. */
  transparent?: boolean;
};

/**
 * Dimmed full-screen layer behind modals and menus; clicking it closes them.
 */
export default function Backdrop({
  isVisible = false,
  onClick,
  className = "",
  transparent = false,
}: BackdropProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isVisible) {
        onClick();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isVisible, onClick]);

  return (
    <div
      className={`fixed z-[60] inset-0 w-dvw h-dvh transition duration-[1000ms] ease-in-out ${
        isVisible
          ? "opacity-100 no-doc-scroll"
          : "opacity-0 pointer-events-none"
      } ${transparent ? "bg-transparent" : "bg-black/30"} ${className}`}
      onClick={onClick}
    />
  );
}

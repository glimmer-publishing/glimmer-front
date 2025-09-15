import { forwardRef, ReactNode } from "react";
import LoaderIcon from "../icons/LoaderIcon";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface MainButtonProps {
  children: string | ReactNode;
  variant?: "primary" | "secondary" | "bordered";
  className?: string;
  type?: "submit" | "button";
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  loadingText?: string;
}

const MainButton = forwardRef<HTMLButtonElement, MainButtonProps>(
  (
    {
      children,
      variant = "primary",
      className = "",
      type = "button",
      disabled = false,
      isLoading = false,
      onClick,
      loadingText,
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={twMerge(
          clsx(
            `group relative overflow-hidden enabled:cursor-pointer flex items-center justify-center px-2 rounded-full ${
              variant === "primary"
                ? "bg-main text-black"
                : variant === "secondary"
                  ? "bg-white text-black"
                  : "border-1 border-black text-black bg-white"
            } 
          disabled:opacity-60 enabled:active:scale-[98%] will-change-transform transition duration-300 ease-in-out`,
            "w-full",
            "text-[12px] lg:text-[15px] font-medium leading-[120%]",
            className
          )
        )}
      >
        <div
          className={`pointer-events-none absolute inset-0 ${
            variant === "primary"
              ? "bg-[linear-gradient(110deg,_rgba(255,255,255,0.1)_0%,_rgba(255,255,255,0.7)_50%,_rgba(255,255,255,0.1)_100%)]"
              : "bg-[linear-gradient(110deg,_rgba(148,197,232,0.1)_0%,_rgba(148,197,232,0.7)_50%,_rgba(148,197,232,0.1)_100%)]"
          }
          bg-[length:200%_100%] opacity-0 transition-opacity duration-500 ease-in-out animate-[shimmer_2.5s_linear_infinite] ${
            disabled
              ? ""
              : "xl:group-hover:opacity-100 group-active:opacity-100 group-focus-visible:opacity-100"
          }`}
        />
        <span className="relative z-10">
          {isLoading ? loadingText : children}
        </span>
        {isLoading ? <LoaderIcon /> : null}
      </button>
    );
  }
);

MainButton.displayName = "MainButton";

export default MainButton;

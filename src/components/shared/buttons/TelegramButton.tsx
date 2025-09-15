import TelegramIcon from "../icons/TelegramIcon";

interface TelegramButtonProps {
  className?: string;
}

export default function TelegramButton({
  className = "",
}: TelegramButtonProps) {
  return (
    <div className="group relative w-fit">
      <button
        type="button"
        className={`group cursor-pointer flex items-center justify-between gap-8 lg:gap-[54px] h-12 lg:h-16 rounded-full bg-black pl-8 lg:pl-10 pr-1.5 lg:pr-2 py-1.5
         lg:py-2 transition duration-300 xl:group-hover:brightness-125 group-focus-visible:brightness-125 group-active:brightness-125 group-active:scale-[98%] ease-in-out
         xl:hover:-translate-y-1 xl:hover:translate-x-1 will-change-transform ${className}`}
      >
        <span className="text-white text-[12px] lg:text-[15px] font-medium">
          Підписатися
        </span>

        <TelegramIcon className="relative z-10 text-white size-9 lg:size-12" />
      </button>
      <span
        className="absolute top-0 left-0 -z-10 w-full h-full rounded-full bg-black/40 blur-xs xl:group-hover:translate-y-1 
      xl:group-hover:-translate-x-1 group-active:scale-[98%] transition duration-300 ease-in-out"
      ></span>
    </div>
  );
}

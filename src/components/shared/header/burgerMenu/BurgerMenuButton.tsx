import BurgerMenuIcon from "../../icons/BurgerMenuIcon";

interface BurgerMenuButtonProps {
  onOpen: () => void;
}

export default function BurgerMenuButton({ onOpen }: BurgerMenuButtonProps) {
  return (
    <button
      aria-label="open menu button"
      type="button"
      onClick={onOpen}
      className="lg:hidden cursor-pointer group outline-none text-white xl:hover:text-main focus-visible:text-main active:scale-95 transition duration-300 ease-in-out"
    >
      <BurgerMenuIcon className="w-6 h-auto" />
    </button>
  );
}

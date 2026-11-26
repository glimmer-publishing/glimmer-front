import BurgerMenuIcon from "@/shared/ui/icons/BurgerMenuIcon";

type HeaderBurgerMenuButtonProps = {
  /* Opens the mobile menu. */
  onOpen: () => void;
};

/**
 * The burger button that opens the mobile menu.
 */
export default function HeaderBurgerMenuButton({
  onOpen,
}: HeaderBurgerMenuButtonProps) {
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

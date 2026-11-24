interface BurgerMenuIconProps {
  className?: string;
}

export default function BurgerMenuIcon({ className }: BurgerMenuIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      aria-label="Burger menu icon"
      className={className}
    >
      <path
        d="M20 7.12927L4 7.12927"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M20 12.1293L4 12.1293"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M20 17.1293L4 17.1293"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

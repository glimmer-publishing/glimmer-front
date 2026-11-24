interface CartIconProps {
  className?: string;
  fillColor?: string;
}

export default function CartIcon({
  className,
  fillColor = "transparent",
}: CartIconProps) {
  return (
    <svg
      width="20"
      height="22"
      viewBox="0 0 20 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Cart icon"
      className={className}
    >
      <path
        d="M0.907227 6.94929L1.93523 17.0828C2.04077 18.1236 2.52891 19.0881 3.30506 19.7896C4.08121 20.491 5.0901 20.8793 6.13623 20.8793H13.8632C14.9094 20.8793 15.9182 20.491 16.6944 19.7896C17.4705 19.0881 17.9587 18.1236 18.0642 17.0828L19.0922 6.94879L0.907227 6.94929Z"
        stroke="currentColor"
        fill={fillColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.81641 6.94928V5.54128C5.81641 4.43188 6.25711 3.36791 7.04158 2.58345C7.82604 1.79898 8.89001 1.35828 9.99941 1.35828C11.1088 1.35828 12.1728 1.79898 12.9572 2.58345C13.7417 3.36791 14.1824 4.43188 14.1824 5.54128V6.94878"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

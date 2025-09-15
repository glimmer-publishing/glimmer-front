interface PlusIconProps {
  iconColor: string;
  bgColor: string;
  className?: string;
}

export default function PlusIcon({
  className,
  iconColor,
  bgColor,
}: PlusIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="41"
      viewBox="0 0 40 41"
      fill="none"
      aria-label="Plus icon"
      className={className}
    >
      <circle
        cx="19.9997"
        cy="20.2586"
        r="16.6667"
        fill={bgColor}
        stroke="#494949"
        style={{
          transition: "fill 0.3s ease, stroke 0.3s ease",
        }}
      />
      <path
        d="M25 20.2586L20 20.2586M20 20.2586L15 20.2586M20 20.2586L20 15.2585M20 20.2586L20 25.2585"
        stroke={iconColor}
        style={{
          transition: "stroke 0.3s ease",
        }}
        strokeLinecap="round"
      />
    </svg>
  );
}

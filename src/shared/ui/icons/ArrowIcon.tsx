interface ArrowIconProps {
  className?: string;
}

export default function ArrowIcon({ className }: ArrowIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      aria-label="Arrow icon"
      className={className}
    >
      <path
        d="M19.4999 9.12927L12.4999 15.1293L5.49994 9.12927"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

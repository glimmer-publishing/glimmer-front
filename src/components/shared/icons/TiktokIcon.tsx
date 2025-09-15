interface TiktokIconProps {
  className?: string;
}

export default function TiktokIcon({ className }: TiktokIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      aria-label="tiktok icon"
      className={className}
    >
      <g clipPath="url(#clip0_431_26622)">
        <path
          d="M15.2 0.658936V18.2589C15.2 19.3665 14.8716 20.4492 14.2562 21.3701C13.6409 22.291 12.7663 23.0088 11.743 23.4327C10.7198 23.8565 9.59379 23.9674 8.5075 23.7513C7.4212 23.5353 6.42338 23.0019 5.6402 22.2187C4.85703 21.4356 4.32368 20.4377 4.1076 19.3514C3.89153 18.2651 4.00243 17.1392 4.42628 16.1159C4.85013 15.0926 5.56789 14.218 6.48881 13.6027C7.40972 12.9874 8.49243 12.6589 9.6 12.6589M22.4 9.45894C20.4904 9.45894 18.6591 8.70037 17.3088 7.35011C15.9586 5.99984 15.2 4.16849 15.2 2.25894"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </g>
      <defs>
        <clipPath id="clip0_431_26622">
          <rect
            width="24"
            height="24"
            fill="currentColor"
            transform="translate(0 0.658936)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

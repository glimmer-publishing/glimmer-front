interface SearchIconProps {
  className?: string;
}

export default function SearchIcon({ className }: SearchIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-label="Search icon"
      className={className}
    >
      <path
        d="M16.625 17.1293L12.7646 13.2689M12.7646 13.2689C13.4249 12.6085 13.9487 11.8246 14.3061 10.9618C14.6635 10.0991 14.8474 9.17434 14.8474 8.24049C14.8474 7.30663 14.6635 6.38191 14.3061 5.51914C13.9487 4.65637 13.4249 3.87244 12.7646 3.2121C12.1043 2.55176 11.3203 2.02795 10.4576 1.67058C9.59478 1.31321 8.67007 1.12927 7.73621 1.12927C6.80235 1.12927 5.87764 1.31321 5.01487 1.67058C4.1521 2.02795 3.36816 2.55176 2.70783 3.2121C1.37421 4.54571 0.625 6.35447 0.625 8.24049C0.625 10.1265 1.37421 11.9353 2.70783 13.2689C4.04144 14.6025 5.8502 15.3517 7.73621 15.3517C9.62222 15.3517 11.431 14.6025 12.7646 13.2689Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

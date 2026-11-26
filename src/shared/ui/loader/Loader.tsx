type LoaderProps = {
  /* Height of the reserved space, so the content below does not jump. */
  className?: string;
};

/**
 * Spinner centred in the space the loading content will take.
 */
export default function Loader({
  className = "h-[220px] lg:h-[350px]",
}: LoaderProps) {
  return (
    <div
      role="status"
      aria-label="Завантаження"
      className={`w-full flex items-center justify-center ${className}`}
    >
      <div className="loader"></div>
    </div>
  );
}

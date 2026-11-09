import Filters from "./Filters";
import Sorting, { SortingProps } from "./Sorting";

export default function FiltersSortPanel(sortingProps: SortingProps) {
  return (
    <div className="flex flex-col gap-y-2 sm:flex-row sm:justify-between">
      <Filters />
      <Sorting {...sortingProps} />
    </div>
  );
}

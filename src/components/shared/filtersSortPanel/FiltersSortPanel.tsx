import Filters from "./Filters";
import Sorting from "./Sorting";

export default function FiltersSortPanel() {
  return (
    <div className="flex flex-col gap-y-2 sm:flex-row sm:justify-between">
      <Filters />
      <Sorting />
    </div>
  );
}

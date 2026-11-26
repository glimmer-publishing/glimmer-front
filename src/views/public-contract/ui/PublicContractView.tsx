import Breadcrumbs from "@/shared/ui/breadcrumbs/Breadcrumbs";
import PublicContract from "./PublicContract";

const CRUMBS = [
  { label: "Головна", href: "/" },
  { label: "Публічний договір", href: "/public-contract" },
];

/**
 * The Публічний договір page: breadcrumbs and the static text.
 */
export default function PublicContractView() {
  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={CRUMBS} />
      <PublicContract />
    </div>
  );
}

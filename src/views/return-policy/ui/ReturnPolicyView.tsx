import Breadcrumbs from "@/shared/ui/breadcrumbs/Breadcrumbs";
import ReturnPolicyContent from "./ReturnPolicyContent";

/* The page's breadcrumb trail. */
const CRUMBS = [
  { label: "Головна", href: "/" },
  { label: "Повернення і обмін", href: "/return-policy" },
];

/**
 * The Повернення і обмін page: breadcrumbs and the static text.
 */
export default function ReturnPolicyView() {
  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={CRUMBS} />
      <ReturnPolicyContent />
    </div>
  );
}

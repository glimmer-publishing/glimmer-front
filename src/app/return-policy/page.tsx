import ReturnPolicy from "@/components/returnPolicyPage/ReturnPolicy";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";

export default function ReturnPolicyPage() {
  const crumbs = [
    { label: "Головна", href: "/" },
    { label: "Повернення і обмін", href: "/return-policy" },
  ];

  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={crumbs} />
      <ReturnPolicy />
    </div>
  );
}

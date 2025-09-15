import PublicContract from "@/components/publicContractPage/PublicContract";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";

export default function PublicContractPage() {
  const crumbs = [
    { label: "Головна", href: "/" },
    {
      label: "Публічний договір",
      href: "/public-contract",
    },
  ];

  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={crumbs} />
      <PublicContract />
    </div>
  );
}

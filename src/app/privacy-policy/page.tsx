import PrivacyPolicy from "@/components/privacyPolicyPage/PrivacyPolicy";
import Breadcrumbs from "@/components/shared/breadcrumbs/Breadcrumbs";

export default function PrivacyPolicyPage() {
  const crumbs = [
    { label: "Головна", href: "/" },
    { label: "Політика конфіденційності", href: "/privacy-policy" },
  ];

  return (
    <div className="pt-[85px]">
      <Breadcrumbs crumbs={crumbs} />
      <PrivacyPolicy />
    </div>
  );
}

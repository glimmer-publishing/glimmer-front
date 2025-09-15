import Link from "next/link";

export default function NavMenu() {
  const navList = [
    { title: "Про нас", link: "/about" },
    { title: "Контакти", link: "/contacts" },
    { title: "Доставка та оплата", link: "/delivery" },
    { title: "Публічний договір", link: "/public-contract" },
  ];

  return (
    <div>
      <h2 className="mb-3 lg:mb-8 text-[16px] lg:text-[18px] font-semibold leading-[120%] text-main">
        Про компанію
      </h2>
      <nav>
        <ul className="flex flex-col gap-4 lg:gap-5">
          {navList.map(({ title, link }, idx) => (
            <li key={idx}>
              <Link
                href={link}
                className="block text-[14px] lg:text-[15px] font-normal leading-[120%] text-white active:text-main xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
              >
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

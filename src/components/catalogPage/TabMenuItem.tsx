interface TabMenuItemProps {
  menuItem: { title: string; value: string };
  activeTab: string;
  handleTabClick: () => void;
}

export default function TabMenuItem({
  menuItem,
  activeTab,
  handleTabClick,
}: TabMenuItemProps) {
  const { title, value } = menuItem;
  return (
    <li className="w-fit leading-none">
      <button
        onClick={handleTabClick}
        className={`cursor-pointer flex items-center justify-center w-full h-7 px-4 border-[0.5px] border-black/70 rounded-full
            text-[12px] lg:text-[14px] font-light leading-none will-change-transform xl:hover:bg-main xl:hover:brightness-110
              focus-visible:bg-main transition duration-300 ease-in-out ${
                value === activeTab ? "bg-main" : "bg-white"
              }`}
      >
        {title}
      </button>
    </li>
  );
}

import InstagramIcon from "@/shared/ui/icons/InstagramIcon";
/**
 * import YoutubeIcon from "@/shared/ui/icons/YoutubeIcon";
 * import FacebookIcon from "@/shared/ui/icons/FacebookIcon";
 * import TiktokIcon from "@/shared/ui/icons/TiktokIcon";
 */
import MonopayIcon from "@/shared/ui/icons/MonoPayIcon";
import { socials } from "@/shared/config/constants";

/**
 * Social media icon links.
 */
export default function FooterSocials() {
  const { instagram } = socials;

  return (
    <ul className="flex gap-5 items-center md:max-w-[176px] lg:max-w-full flex-wrap">
      {/* <li>
        <a
          href={facebook}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex items-center text-white active:text-main xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
        >
          <FacebookIcon className="size-8" />
        </a>
      </li>
      <li>
        <a
          href={tiktok}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex items-center text-white active:text-main xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
        >
          <TiktokIcon className="size-6" />
        </a>
      </li>
      <li>
        <a
          href={youtube}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex items-center text-white active:text-main xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
        >
          <YoutubeIcon className="size-8" />
        </a>
      </li> */}
      <li>
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex items-center text-white active:text-main xl:hover:text-main focus-visible:text-main transition duration-300 ease-in-out"
        >
          <InstagramIcon className="size-7" />
        </a>
      </li>

      <li>
        <MonopayIcon className="w-[76px] h-auto text-white" />
      </li>
    </ul>
  );
}

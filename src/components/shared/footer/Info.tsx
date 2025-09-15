import Socials from "./Socials";
import { PHONE, WORKING_HOURS } from "@/constants/constants";

export default function Info() {
  return (
    <div className="min-h-full lg:flex flex-col justify-between">
      <div className="mb-8">
        <a
          href={`tel:${PHONE}`}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="block mb-10 text-main text-[16px] lg:text-[18px] font-semibold active:brightness-125 xl:hover:brightness-125 focus-visible:brightness-125 transition duration-300 ease-in-out"
        >
          0 77 837 84 53
        </a>

        <p className="text-white text-[16px] lg:text-[18px] font-semibold">
          {WORKING_HOURS}
        </p>
      </div>
      <Socials />
    </div>
  );
}

import Confirmation from "@/components/confirmationPage/Confirmation";
import MarqueeLine from "@/components/shared/marquee/MarqueeLine";
import TelegramCTA from "@/components/shared/telegramCTA/TelegramCTA";

export default function ConfirmationPage() {
  return (
    <div className="pt-[85px]">
      <Confirmation />
      <MarqueeLine />
      <TelegramCTA />
    </div>
  );
}

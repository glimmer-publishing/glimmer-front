import Link from "next/link";
import Container from "@/components/shared/container/Container";
import MainButton from "@/components/shared/buttons/MainButton";
import MarqueeLine from "@/components/shared/marquee/MarqueeLine";

/* Shown for unknown URLs and for notFound() on unknown books, categories,
   authors and series. Deliberately static and light: bots hit it often. */
export default function NotFound() {
  return (
    <div className="pt-[85px]">
      <section className="py-[120px] lg:py-[160px]">
        <Container className="flex flex-col items-center text-center gap-4 lg:gap-6">
          <p className="text-[48px] lg:text-[80px] font-semibold leading-none text-main">
            404
          </p>
          <h1 className="text-[22px] lg:text-[32px] font-semibold leading-[120%]">
            Сторінку не знайдено
          </h1>
          <p className="max-w-[420px] text-[14px] lg:text-[18px] font-light leading-[120%] text-black/60">
            Можливо, книгу прибрали з каталогу або посилання застаріло.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[420px] mt-2">
            <Link href="/" className="sm:w-[calc(50%-6px)]">
              <MainButton className="h-[45px] text-[12px] lg:text-[14px] font-normal">
                На головну
              </MainButton>
            </Link>
            <Link href="/catalog/all" className="sm:w-[calc(50%-6px)]">
              <MainButton
                variant="bordered"
                className="h-[45px] text-[12px] lg:text-[14px] font-normal"
              >
                Весь каталог
              </MainButton>
            </Link>
          </div>
        </Container>
      </section>
      <MarqueeLine />
    </div>
  );
}

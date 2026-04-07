import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function About() {
  return (
    <div className="h-screen snap-start flex flex-col items-center justify-between p-20">
      <div className="text-center">
        <h2 className="text-4xl font-bold">O nas</h2>
        <p className="mt-4 text-lg">
          Dowiedz się więcej o naszej firmie i naszych usługach
        </p>
      </div>
      <div className="flex flex-row justify-between gap-20 items-center">
        <div className="text-xl w-1/2">
          Jesteśmy firmą technologiczną specjalizującą się w tworzeniu narzędzi
          do budowy i zarządzania landing page w modelu CMS. Naszą misją jest
          upraszczanie procesu tworzenia stron sprzedażowych tak, aby był
          szybki, przewidywalny i dostępny dla każdego zespołu — od freelancerów
          po rozwijające się firmy.
          <Separator className="my-4" />
          Budujemy oprogramowanie, które łączy elastyczność systemów CMS z
          wydajnością nowoczesnych platform webowych. Stawiamy na praktyczne
          rozwiązania: przejrzysty edytor, stabilną infrastrukturę i funkcje
          zaprojektowane pod realne potrzeby marketingu oraz sprzedaży.
          <Separator className="my-4" />
          Wierzymy, że skuteczne landing page nie powinny wymagać długiego
          procesu wdrożenia ani zaawansowanej wiedzy technicznej. Dlatego
          rozwijamy narzędzie, które pozwala tworzyć, testować i optymalizować
          strony w jednym środowisku — szybko, bezpiecznie i bez kompromisów
          jakościowych.
        </div>
        <div className="w-1/2">
          <Image
            src="/about-image.jpg"
            alt="About Us"
            width={700}
            height={300}
            className="rounded-md"
          />
        </div>
      </div>
      <div></div>
    </div>
  );
}

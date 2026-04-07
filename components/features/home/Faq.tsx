import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Faq() {
  return (
    <div className="h-screen snap-start flex flex-col justify-between p-20">
      <div className="text-center">
        <h2 className="text-4xl font-bold">FAQ</h2>
        <p className="text-lg">Często zadawane pytania</p>
      </div>
      <div className="w-1/2 mx-auto">
        <Accordion
          type="single"
          defaultValue="experience"
          collapsible
          className="rounded-md border p-5"
        >
          <AccordionItem value="experience">
            <AccordionTrigger className="font-bold">
              Czy wymagane jest doświadczenie?
            </AccordionTrigger>
            <AccordionContent className="text-gray-400">
              Nie, nasza strona jest zaprojektowana tak, aby była dostępny dla
              osób bez wcześniejszego doświadczenia w programowaniu.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="after-publishing">
            <AccordionTrigger className="font-bold">
              Czy mogę edytować stronę po publikacji?
            </AccordionTrigger>
            <AccordionContent className="text-gray-400">
              Oczywiście. Zmiany możesz wprowadzać w dowolnym momencie bez
              przerywania działania strony.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="plans">
            <AccordionTrigger className="font-bold">
              Czy mogę stworzyć stronę bez wykupienia planu?
            </AccordionTrigger>
            <AccordionContent className="text-gray-400">
              Tak, oferujemy darmowy plan, który pozwala na stworzenie i
              publikację strony bez żadnych kosztów. Możesz korzystać z
              wszystkich funkcji, jednak limit stron jest ograniczony do jednej.
              Jeśli potrzebujesz więcej stron lub dodatkowych funkcji, możesz
              rozważyć nasze płatne plany.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div></div>
    </div>
  );
}

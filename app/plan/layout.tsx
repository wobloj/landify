import Notification from "@/components/features/Notification";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Notification>
        Aktualne płatności za subskrypcje są darmowe, by pomyślnie przejść
        płatność wpisz numer karty
        <span className="font-bold">4242 4242 4242 4242</span>
        oraz dowolną datę ważności i kod CVC.
      </Notification>
      {children}
    </div>
  );
}

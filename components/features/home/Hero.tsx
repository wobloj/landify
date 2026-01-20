import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="h-screen snap-start flex flex-col gap-20 items-center justify-center">
      <div className="text-center">
        <h1 className="text-8xl font-semibold">LANDIFY</h1>
        <p className="text-xl mt-4">
          Stwórz swoją wymarzoną strone w kilka minut
        </p>
      </div>
      <div>
        <Link href="/auth">
          <Button
            variant={"outline"}
            className="text-2xl px-10 py-6 cursor-pointer"
          >
            Zacznij teraz!
          </Button>
        </Link>
      </div>
    </div>
  );
}

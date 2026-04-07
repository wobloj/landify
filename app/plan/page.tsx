import Plans from "@/components/features/Plans";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";

export default function EditPlan() {
  return (
    <>
      <header className="my-20 flex flex-col items-center gap-4">
        <h1 className="text-3xl font-semibold">Zmień swój plan</h1>
        <Button variant="outline" asChild>
          <a href="/dashboard">
            <Undo2 />
            Powrót do dashboardu
          </a>
        </Button>
      </header>
      <Plans />
    </>
  );
}

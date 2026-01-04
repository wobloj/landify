import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { ChevronLeft } from "lucide-react";
import { HeroType } from "@/lib/types/types";
import { useChanges } from "@/context/ChangesContext";

interface HeroEditorProps {
  heroData: HeroType;
  onClick: () => void;
}

export default function HeroEditor({ heroData, onClick }: HeroEditorProps) {
  const { updateSection } = useChanges();

  return (
    <div className="animate-in slide-in-from-right-8 duration-300">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" onClick={onClick}>
          <ChevronLeft className="w-4 h-4" />
          <span className="font-semibold text-sm">Edycja: Hero</span>
        </Button>
      </div>

      <div className="space-y-4 bg-background rounded-xl p-4">
        <div className="space-y-2">
          <Label>Nagłówek</Label>
          <Input
            name="title"
            defaultValue={heroData.title}
            onChange={(e) => updateSection("hero", { title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Podtytuł</Label>
          <Textarea
            name="subtitle"
            defaultValue={heroData.data_json.subtitle}
            onChange={(e) =>
              updateSection("hero", {
                data_json: {
                  ...heroData.data_json,
                  subtitle: e.target.value,
                },
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

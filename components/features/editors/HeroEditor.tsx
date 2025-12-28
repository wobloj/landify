import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { ChevronLeft } from "lucide-react";
import SubmitButton from "../SubmitButton";
import { HeroType } from "@/lib/supabase/types/sectionTypes";
import { saveSectionSettings } from "@/app/admin/action";

interface HeroEditorProps {
  heroData: HeroType;
  onClick: () => void;
}

export default function HeroEditor({ heroData, onClick }: HeroEditorProps) {
  return (
    <div className="animate-in slide-in-from-right-8 duration-300">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" onClick={onClick}>
          <ChevronLeft className="w-4 h-4" />
          <span className="font-semibold text-sm">Edycja: Hero</span>
        </Button>
      </div>

      <form action={saveSectionSettings}>
        <input type="hidden" name="section_type" value="hero" />

        <div className="space-y-4 bg-background rounded-xl p-4">
          <div className="space-y-2">
            <Label>Nagłówek</Label>
            <Input name="title" defaultValue={heroData.title} />
          </div>

          <div className="space-y-2">
            <Label>Podtytuł</Label>
            <Textarea
              name="subtitle"
              defaultValue={heroData.data_json.subtitle}
            />
          </div>
        </div>

        <SubmitButton className="w-full" size="sm">
          Zapisz zmiany w Hero
        </SubmitButton>
      </form>
    </div>
  );
}

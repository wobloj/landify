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
        {/* 🔥 KLUCZOWE */}
        <input type="hidden" name="section_type" value="hero" />
        <Label className="font-bold">Ogólne</Label>
        <div className="space-y-4">
          <div className="flex flex-col gap-4 bg-background rounded-xl p-4">
            <div className="space-y-2">
              <Label htmlFor="title">Nagłówek</Label>
              <Input id="title" name="title" defaultValue={heroData.title} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Podtytuł</Label>
              <Textarea
                id="subtitle"
                name="subtitle"
                className="h-20 resize-none"
                defaultValue={heroData.data_json.subtitle}
              />
            </div>
          </div>

          {/* 🔥 data_json składane Z FORMULARZA */}
          <input
            type="hidden"
            name="data_json"
            value={JSON.stringify({
              subtitle: heroData.data_json.subtitle,
            })}
          />

          <div className="pt-4 border-t">
            <SubmitButton className="w-full" size="sm">
              Zapisz zmiany w Hero
            </SubmitButton>
          </div>
        </div>
      </form>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { ChevronLeft } from "lucide-react";
import SubmitButton from "../SubmitButton";
import { HeroType } from "@/lib/supabase/types/sectionTypes";

interface HeroEditorProps {
  heroData: HeroType;
  onClick: () => void;
}

export default function HeroEditor({ heroData, onClick }: HeroEditorProps) {
  //   const handleSaveHeroSettings = async (formData: FormData) => {
  //     await saveHeroSettings(formData);
  //   };

  return (
    <div className="animate-in slide-in-from-right-8 duration-300">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" onClick={onClick}>
          <>
            <ChevronLeft className="w-4 h-4" />

            <span className="font-semibold text-sm">Edycja: Hero</span>
          </>
        </Button>
      </div>

      <form>
        <div className="space-y-4">
          <div className="flex flex-col gap-4 bg-background rounded-xl p-4">
            <div className="space-y-2">
              <Label htmlFor="hero_title">Nagłówek</Label>

              <Input
                id="hero_title"
                name="hero_title"
                defaultValue={heroData?.title}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero_subtitle">Podtytuł</Label>

              <Textarea
                id="hero_subtitle"
                name="hero_subtitle"
                className="h-20 resize-none"
                defaultValue={heroData?.data_json.subtitle}
              />
            </div>
          </div>

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

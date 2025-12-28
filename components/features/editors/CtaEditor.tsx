import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { ChevronLeft } from "lucide-react";
import SubmitButton from "../SubmitButton";
import { CtaType } from "@/lib/supabase/types/sectionTypes";
import { saveSectionSettings } from "@/app/admin/action";

interface CtaEditorProps {
  ctaData: CtaType;
  onClick: () => void;
}

export default function CtaEditor({ ctaData, onClick }: CtaEditorProps) {
  return (
    <div className="animate-in slide-in-from-right-8 duration-300">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" onClick={onClick}>
          <>
            <ChevronLeft className="w-4 h-4" />

            <span className="font-semibold text-sm">Edycja: CTA</span>
          </>
        </Button>
      </div>

      <form action={saveSectionSettings}>
        <input type="hidden" name="section_type" value="cta" />

        <div className="space-y-4">
          <Label className="font-semibold">Ogólne</Label>
          <div className="bg-background p-4 my-2 rounded-md flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Nagłówek</Label>

              <Input id="title" name="title" defaultValue={ctaData?.title} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Podtytuł</Label>

              <Textarea
                id="desc"
                name="desc"
                defaultValue={ctaData?.data_json.desc}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="button_text">Tekst przycisku</Label>

              <Input
                id="button_text"
                type="text"
                name="button_text"
                defaultValue={ctaData?.data_json.button_text}
              />
            </div>
          </div>
          <div className="pt-4 border-t">
            <SubmitButton className="w-full" size="sm">
              Zapisz zmiany w CTA
            </SubmitButton>
          </div>
        </div>
      </form>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { ChevronLeft } from "lucide-react";
import { CtaType } from "@/lib/types/types";
import { useChanges } from "@/context/ChangesContext";

interface CtaEditorProps {
  ctaData: CtaType;
  onClick: () => void;
}

export default function CtaEditor({ ctaData, onClick }: CtaEditorProps) {
  const { updateSection } = useChanges();

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

      <div className="space-y-4">
        <Label className="font-semibold">Ogólne</Label>
        <div className="bg-background p-4 my-2 rounded-md flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Nagłówek</Label>
            <Input
              id="title"
              name="title"
              defaultValue={ctaData?.title}
              onChange={(e) => updateSection("cta", { title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Podtytuł</Label>
            <Textarea
              id="desc"
              name="desc"
              defaultValue={ctaData?.data_json.desc}
              onChange={(e) =>
                updateSection("cta", {
                  data_json: {
                    ...ctaData.data_json,
                    desc: e.target.value,
                  },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="button_text">Tekst przycisku</Label>
            <Input
              id="button_text"
              type="text"
              name="button_text"
              defaultValue={ctaData?.data_json.button_text}
              onChange={(e) =>
                updateSection("cta", {
                  data_json: {
                    ...ctaData.data_json,
                    button_text: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

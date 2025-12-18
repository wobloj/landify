import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { ChevronLeft } from "lucide-react";
import SubmitButton from "../SubmitButton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { iconOptions } from "@/lib/consts/icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FeaturesType } from "@/lib/supabase/types/sectionTypes";
import { saveSectionSettings } from "@/app/admin/action";

interface FeaturesEditorProps {
  featuresData: FeaturesType;
  onClick: () => void;
}

export default function FeaturesEditor({
  featuresData,
  onClick,
}: FeaturesEditorProps) {
  const items = featuresData?.data_json?.items || [];

  return (
    <div className="animate-in slide-in-from-right-8 duration-300">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" onClick={onClick}>
          <>
            <ChevronLeft className="w-4 h-4" />

            <span className="font-semibold text-sm">Edycja: Features</span>
          </>
        </Button>
      </div>

      <form action={saveSectionSettings}>
        <input type="hidden" name="section_type" value={"features"} />
        <div className="space-y-4">
          <Label className="font-bold">Ogólne</Label>
          <div className="space-y-2 bg-background p-4 rounded-md">
            <Label htmlFor="features_title">Nagłówek</Label>

            <Input
              id="features_title"
              name="features_title"
              defaultValue={featuresData?.title}
            />
          </div>
          <Label className="font-bold">Sekcje</Label>
          <ScrollArea className="h-96 pr-2">
            {items.map((item, index: number) => (
              <div
                key={index}
                className="flex flex-col space-y-2 border-2 bg-background rounded-md p-4"
              >
                <Label className="font-bold">{`Sekcja ${index + 1}`}</Label>

                <Label>Ikona sekcji</Label>
                <Select value={item.icon}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Wybierz ikonę" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Ikony</SelectLabel>
                      {iconOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <option.icon className="w-4 h-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <div>
                  <Label>Tytuł sekcji</Label>
                  <Input value={item.title} />
                </div>

                <div>
                  <Label>Opis sekcji</Label>
                  <Input value={item.desc} />
                </div>
              </div>
            ))}
          </ScrollArea>
          <div className="pt-4 border-t">
            <SubmitButton className="w-full" size="sm">
              Zapisz zmiany w Features
            </SubmitButton>
          </div>
        </div>
      </form>
    </div>
  );
}

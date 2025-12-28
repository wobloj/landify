import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { ArrowDown, ChevronLeft } from "lucide-react";
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
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FeaturesEditorProps {
  featuresData: FeaturesType;
  onClick: () => void;
}

export default function FeaturesEditor({
  featuresData,
  onClick,
}: FeaturesEditorProps) {
  const items = featuresData?.data_json?.items || [];
  const [localItems, setLocalItems] = useState(items);

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
            <Label htmlFor="title">Nagłówek</Label>

            <Input id="title" name="title" defaultValue={featuresData?.title} />
          </div>
          <Label className="font-bold">Sekcje</Label>
          <ScrollArea className="h-96 pr-2 flex">
            {localItems.map((item, index) => (
              <div
                key={index}
                className="space-y-2 bg-background p-4 rounded-md my-2"
              >
                <Collapsible className="group">
                  <CollapsibleTrigger className="w-full cursor-pointer mt-2">
                    <div className="flex flex-row items-center justify-between">
                      <Label className="font-bold">Sekcja {index + 1}</Label>
                      <ArrowDown
                        size={18}
                        className="transition-transform group-data-[state=open]:rotate-180"
                      />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-5 flex flex-col gap-4">
                    <div>
                      <Label>Ikona sekcji</Label>

                      <Select
                        value={item.icon}
                        onValueChange={(value) => {
                          setLocalItems((prev) => {
                            const copy = [...prev];
                            copy[index] = { ...copy[index], icon: value };
                            return copy;
                          });
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          {iconOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <option.icon className="w-4 h-4" />
                                {option.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Tytuł sekcji</Label>

                      <Input
                        name={`items[${index}].title`}
                        value={item.title}
                        onChange={(e) => {
                          const value = e.target.value;
                          setLocalItems((prev) => {
                            const copy = [...prev];
                            copy[index] = { ...copy[index], title: value };
                            return copy;
                          });
                        }}
                      />
                    </div>

                    <div>
                      <Label>Opis sekcji</Label>

                      <Input
                        name={`items[${index}].desc`}
                        value={item.desc}
                        onChange={(e) => {
                          const value = e.target.value;
                          setLocalItems((prev) => {
                            const copy = [...prev];
                            copy[index] = { ...copy[index], desc: value };
                            return copy;
                          });
                        }}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                <input
                  type="hidden"
                  name={`items[${index}].icon`}
                  value={item.icon}
                />
                <input
                  type="hidden"
                  name={`items[${index}].title`}
                  value={item.title}
                />
                <input
                  type="hidden"
                  name={`items[${index}].desc`}
                  value={item.desc}
                />
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

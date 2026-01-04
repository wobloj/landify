import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { ArrowDown, ChevronLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { iconOptions } from "@/lib/consts/icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FeaturesType } from "@/lib/types/types";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useChanges } from "@/context/ChangesContext";

interface FeaturesEditorProps {
  featuresData: FeaturesType;
  onClick: () => void;
}

export default function FeaturesEditor({
  featuresData,
  onClick,
}: FeaturesEditorProps) {
  const { updateSection } = useChanges();
  const items = featuresData?.data_json?.items || [];
  const [localItems, setLocalItems] = useState(items);

  // Helper function to update both local state and context
  const updateItems = (newItems: typeof items) => {
    setLocalItems(newItems);
    updateSection("features", {
      data_json: { items: newItems },
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSection("features", { title: e.target.value });
  };

  const handleIconChange = (index: number, value: string) => {
    const newItems = [...localItems];
    newItems[index] = { ...newItems[index], icon: value };
    updateItems(newItems);
  };

  const handleItemTitleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newItems = [...localItems];
    newItems[index] = { ...newItems[index], title: e.target.value };
    updateItems(newItems);
  };

  const handleItemDescChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newItems = [...localItems];
    newItems[index] = { ...newItems[index], desc: e.target.value };
    updateItems(newItems);
  };

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

      <div className="space-y-4">
        <Label className="font-bold">Ogólne</Label>
        <div className="space-y-2 bg-background p-4 rounded-md">
          <Label htmlFor="title">Nagłówek</Label>
          <Input
            id="title"
            name="title"
            defaultValue={featuresData?.title}
            onChange={handleTitleChange}
          />
        </div>

        <Label className="font-bold">Sekcje</Label>
        <ScrollArea className="h-96 pr-2 flex">
          {localItems.map((item, index) => (
            <div
              key={index}
              className="space-y-2 bg-background p-4 rounded-md my-2"
            >
              <Collapsible className="group">
                <CollapsibleTrigger className="w-full cursor-pointer mt-2 mb-1">
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
                      onValueChange={(value) => handleIconChange(index, value)}
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
                      onChange={(e) => handleItemTitleChange(index, e)}
                    />
                  </div>

                  <div>
                    <Label>Opis sekcji</Label>
                    <Input
                      name={`items[${index}].desc`}
                      value={item.desc}
                      onChange={(e) => handleItemDescChange(index, e)}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}

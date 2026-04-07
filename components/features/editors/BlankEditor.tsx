import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useChanges } from "@/context/ChangesContext";
import { BlankSectionType } from "@/lib/types/types";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

export function BlankEditor({
  blankData,
  onClick,
}: {
  blankData: BlankSectionType;
  onClick: () => void;
}) {
  const { updateSection } = useChanges();
  const [numberOfColumns, setNumberOfColumns] = useState(
    blankData.data_json.columns.length,
  );
  return (
    <div className="animate-in slide-in-from-right-8">
      <Button className="mb-4 font-semibold" variant="ghost" onClick={onClick}>
        <ChevronLeft className="w-4 h-4" />
        Edycja: Blank
      </Button>

      <div className="space-y-4 p-4 bg-background rounded-md">
        <Label>Tytuł</Label>
        <Textarea
          defaultValue={blankData.title}
          onChange={(e) =>
            updateSection("blank", {
              title: e.target.value,
            })
          }
        />

        <Label>Opis</Label>
        <Textarea
          defaultValue={blankData.data_json.desc}
          onChange={(e) =>
            updateSection("blank", {
              data_json: {
                ...blankData.data_json,
                desc: e.target.value,
              },
            })
          }
        />

        <Select>
          <SelectTrigger className="w-full">
            Liczba kolumn: {numberOfColumns}
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              onClick={() => {
                setNumberOfColumns(1);
              }}
              value={"1"}
            >
              1
            </SelectItem>
            <SelectItem
              onClick={() => {
                setNumberOfColumns(2);
              }}
              value={"2"}
            >
              2
            </SelectItem>
            <SelectItem
              onClick={() => {
                setNumberOfColumns(3);
              }}
              value={"3"}
            >
              3
            </SelectItem>
          </SelectContent>
        </Select>

        {blankData.data_json.columns.map((col, i) => (
          <div key={i}>
            <Label className="mb-2">Kolumna {i + 1}</Label>
            <Textarea
              defaultValue={col}
              onChange={(e) => {
                const next = [...blankData.data_json.columns];
                next[i] = e.target.value;

                updateSection("blank", {
                  data_json: {
                    ...blankData.data_json,
                    columns: next,
                  },
                });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

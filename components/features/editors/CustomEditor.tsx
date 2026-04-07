import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  Grid2X2,
  LayoutGrid,
  LayoutPanelTop,
  RectangleHorizontal,
} from "lucide-react";

export default function CustomEditor() {
  return (
    <div className="animate-in slide-in-from-right-8">
      <Button className="mb-4 font-semibold" variant="ghost">
        <ChevronLeft className="w-4 h-4" />
        Edycja: Blank
      </Button>
      <div className="mx-5">
        <Label className="mb-2" htmlFor="grid">
          Układ strony
        </Label>
        <Select>
          <SelectTrigger className="w-full">
            <div className="flex flex-row gap-2 items-center ">
              <SelectValue placeholder="Wybierz układ strony" />
            </div>
          </SelectTrigger>
          <SelectContent id="grid">
            <SelectItem value="fill">
              <div className="flex flex-row items-center gap-2">
                <RectangleHorizontal />
                1x1
              </div>
            </SelectItem>
            <SelectItem value="t1b2">
              <LayoutPanelTop /> 1x2
            </SelectItem>
            <SelectItem value="t2b1">
              <LayoutPanelTop className="rotate-180" />
              2x1
            </SelectItem>
            <SelectItem value="t2b2">
              <Grid2X2 />
              2x2
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

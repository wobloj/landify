import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChanges } from "@/context/ChangesContext";
import { VideoSectionType } from "@/lib/types/types";
import { Label } from "@radix-ui/react-label";
import { ChevronLeft, Info } from "lucide-react";

export function VideoEditor({
  videoData,
  onClick,
}: {
  videoData: VideoSectionType;
  onClick: () => void;
}) {
  const { updateSection } = useChanges();

  return (
    <div className="animate-in slide-in-from-right-8">
      <Button className="mb-4 font-semibold" variant="ghost" onClick={onClick}>
        <ChevronLeft className="w-4 h-4" />
        Edycja: Video
      </Button>

      <div className="space-y-4 p-4 bg-background rounded-md">
        <Label>Tytuł</Label>
        <Textarea
          defaultValue={videoData.title}
          onChange={(e) =>
            updateSection("video", {
              title: e.target.value,
            })
          }
        />

        <Label>Opis</Label>
        <Textarea
          defaultValue={videoData.data_json.desc}
          onChange={(e) =>
            updateSection("video", {
              data_json: {
                ...videoData.data_json,
                desc: e.target.value,
              },
            })
          }
        />

        <Label htmlFor="url" className="flex items-center gap-2 mb-2">
          URL wideo
          <Tooltip>
            <TooltipTrigger>
              <Info size={16} />
            </TooltipTrigger>
            <TooltipContent side="right">
              Podaj pełny URL kopiując link z YouTube lub prześlij od razu link
              &quot;embed&quot;
            </TooltipContent>
          </Tooltip>
        </Label>
        <Input
          id="url"
          defaultValue={videoData.data_json.url}
          onChange={(e) =>
            updateSection("video", {
              data_json: {
                ...videoData.data_json,
                url: e.target.value,
              },
            })
          }
        />
      </div>
    </div>
  );
}

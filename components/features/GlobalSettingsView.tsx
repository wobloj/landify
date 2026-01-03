import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "./SubmitButton";
import { SiteConfig } from "@/lib/supabase/data";
import {
  publishPageAction,
  saveGlobalSettings,
  unpublishPageAction,
} from "@/app/admin/action";
import ColorPresets from "./ColorPresets";
import { useState } from "react";
import {
  AlignVerticalJustifyCenterIcon,
  Palette,
  Settings2,
  Wrench,
} from "lucide-react";

interface GlobalSettingsProps {
  initialSiteConfig: SiteConfig;
}

export default function GlobalSettingsView({
  initialSiteConfig,
}: GlobalSettingsProps) {
  const [activePreset, setActivePreset] = useState<number | null>(null);

  const handleSaveGlobalSettings = async (formData: FormData) => {
    await saveGlobalSettings(formData);
  };
  const handlePublishPage = async () => {
    await publishPageAction();
  };

  const handleUnpublishPage = async () => {
    await unpublishPageAction();
  };

  return (
    <div className="flex flex-col gap-6 py-4 animate-in fade-in slide-in-from-left-4 duration-300">
      {/* Formularz ustawień globalnych */}
      <form action={handleSaveGlobalSettings} className="flex flex-col">
        <div className="space-y-2 mb-6">
          <Label className="text-xs font-semibold uppercase text-muted-foreground">
            <Settings2 size={18} />
            Główne ustawienia
          </Label>

          <div className="flex items-center gap-3 p-3 border rounded-md bg-background">
            <div className="space-y-2  w-full">
              <Label htmlFor="app_title" className="text-sm">
                Tytuł strony
              </Label>
              <Input
                type="text"
                name="app_title"
                defaultValue={initialSiteConfig.app_title}
                placeholder="Np. Mój Startup"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 border rounded-md bg-background">
            <div className="space-y-2  w-full">
              <Label
                htmlFor="spacing"
                className="text-sm flex flex-col items-start gap-0"
              >
                Odstęp pomiędzy sekcjami
                <p className="text-muted-foreground">(w px)</p>
              </Label>
              <div className="flex flex-row items-center gap-2">
                <AlignVerticalJustifyCenterIcon size={18} />
                <div className="flex flex-row justify-between items-center w-full gap-2">
                  <Input
                    type="number"
                    min={0}
                    name="spacing"
                    defaultValue={String(initialSiteConfig.spacing).replace(
                      "px",
                      ""
                    )}
                    placeholder="16"
                  />
                  <p className="text-muted-foreground">px</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground">
              <Palette size={18} />
              Wygląd
            </Label>
            <ColorPresets
              index={0}
              activePreset={activePreset}
              setActivePreset={setActivePreset}
              colors={["#f8fafc", "#6366f1", "#e5e7eb", "#1e293b", "#6b7280"]}
            >
              Clean Slate
            </ColorPresets>
          </div>
          <div className="space-y-2">
            <ColorPresets
              index={1}
              activePreset={activePreset}
              setActivePreset={setActivePreset}
              colors={["#f8f5f0", "#2e7d32", "#e8f5e9", "#3e2723", "#6d4c41"]}
            >
              Earthy Forest Hues
            </ColorPresets>
          </div>
          <div className="space-y-2">
            <ColorPresets
              index={2}
              activePreset={activePreset}
              setActivePreset={setActivePreset}
              colors={["#DAD7CD", "#A3B18A", "#588157", "#3A5A40", "#344E41"]}
            >
              Nature
            </ColorPresets>
          </div>
          <div className="space-y-2">
            <ColorPresets
              index={3}
              activePreset={activePreset}
              setActivePreset={setActivePreset}
              colors={["#f9f9f9", "#644a40", "#ffdfb5", "#202020", "#646464"]}
            >
              Caffeine
            </ColorPresets>
          </div>
        </div>
        <div className="pt-2">
          <SubmitButton className="w-full" size="sm">
            Zapisz Ustawienia Globalne
          </SubmitButton>
        </div>

        <input type="hidden" name="bg_color" />
        <input type="hidden" name="primary_color" />
        <input type="hidden" name="secondary_color" />
        <input type="hidden" name="text_color_primary" />
        <input type="hidden" name="text_color_secondary" />
      </form>

      {/* Panel Publikacji */}
      <div className="space-y-3 pt-4 border-t">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
          <Wrench size={18} />
          Status Strony
        </Label>

        <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                initialSiteConfig.is_published
                  ? "bg-green-500 animate-pulse"
                  : "bg-red-500"
              }`}
            />
            <span className="text-sm font-medium">
              {initialSiteConfig.is_published ? "Opublikowana" : "W Budowie"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <form action={handleUnpublishPage} className="w-full">
            <SubmitButton
              variant="outline"
              className="w-full"
              size="sm"
              disabled={!initialSiteConfig.is_published}
            >
              Ukryj
            </SubmitButton>
          </form>

          <form action={handlePublishPage} className="w-full">
            <SubmitButton
              variant="default"
              className="w-full"
              size="sm"
              disabled={initialSiteConfig.is_published}
            >
              Opublikuj
            </SubmitButton>
          </form>
        </div>
      </div>
    </div>
  );
}

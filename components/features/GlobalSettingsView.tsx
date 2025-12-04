import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "./SubmitButton";
import { SiteConfig } from "@/lib/supabase/data";
import {
  publishPageAction,
  saveGlobalSettings,
  unpublishPageAction,
} from "@/app/admin/action";

interface GlobalSettingsProps {
  initialSiteConfig: SiteConfig;
}

export default function GlobalSettingsView({
  initialSiteConfig,
}: GlobalSettingsProps) {
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
      <form action={handleSaveGlobalSettings} className="flex flex-col gap-6">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase text-muted-foreground">
            Główne ustawienia
          </Label>

          <div className="space-y-4 bg-background p-3 rounded-md border">
            <div className="space-y-2">
              <Label htmlFor="app_title" className="text-sm">
                Tytuł strony (App Title)
              </Label>
              <Input
                type="text"
                name="app_title" // Upewnij się, że action.ts obsługuje to pole
                defaultValue={initialSiteConfig.app_title}
                placeholder="Np. Mój Startup"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase text-muted-foreground">
            Wygląd
          </Label>

          <div className="flex items-center gap-3 p-3 border rounded-md bg-background">
            <div className="relative">
              <Input
                type="color"
                name="primary_color"
                defaultValue={initialSiteConfig.primary_color}
                className="w-10 h-10 p-0 border-0 rounded-none cursor-pointer overflow-hidden"
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="primary_color" className="text-sm">
                Kolor Główny
              </Label>
              <p className="text-xs text-muted-foreground">
                Motyw przewodni strony
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 border rounded-md bg-background">
            <div className="relative">
              <Input
                type="color"
                name="secondary_color"
                defaultValue={initialSiteConfig.secondary_color}
                className="w-10 h-10 p-0 border-0 rounded-none cursor-pointer overflow-hidden"
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="secondary_color" className="text-sm">
                Kolor Drugorzędny
              </Label>
              <p className="text-xs text-muted-foreground">
                Motyw uzupełniający strony
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 border rounded-md bg-background">
            <div className="relative">
              <Input
                type="color"
                name="bg_color"
                defaultValue={initialSiteConfig.bg_color}
                className="w-10 h-10 p-0 border-0 rounded-none cursor-pointer overflow-hidden"
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="bg_color" className="text-sm">
                Kolor Tła
              </Label>
              <p className="text-xs text-muted-foreground">Kolor tła strony</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 border rounded-md bg-background">
            <div className="relative">
              <Input
                type="color"
                name="text_color"
                defaultValue={initialSiteConfig.text_color}
                className="w-10 h-10 p-0 border-0 rounded-none cursor-pointer overflow-hidden"
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="text_color" className="text-sm">
                Kolor Czcionki
              </Label>
              <p className="text-xs text-muted-foreground">
                Kolor podstawowy czcionki
              </p>
            </div>
          </div>
        </div>
        <div className="pt-2">
          <SubmitButton className="w-full" size="sm">
            Zapisz Ustawienia Globalne
          </SubmitButton>
        </div>
      </form>

      {/* Panel Publikacji */}
      <div className="space-y-3 pt-4 border-t">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">
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

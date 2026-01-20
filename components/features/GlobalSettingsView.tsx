"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { publishPageAction, unpublishPageAction } from "@/app/admin/action";
import ColorPresets from "./ColorPresets";
import { useState } from "react";
import {
  AlignVerticalJustifyCenterIcon,
  ArrowDown,
  Palette,
  PanelBottom,
  Settings2,
  Wrench,
} from "lucide-react";
import { useChanges } from "@/context/ChangesContext";
import SubmitButton from "./SubmitButton";
import { FooterConfig, SiteConfig } from "@/lib/types/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { updateFooterContent } from "@/lib/supabase/data";
import DropdownSocials from "./DropdownSocials";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";

interface GlobalSettingsProps {
  initialSiteConfig: SiteConfig;
  initialFooterConfig: FooterConfig;
}

export default function GlobalSettingsView({
  initialSiteConfig,
  initialFooterConfig,
}: GlobalSettingsProps) {
  const [activePreset, setActivePreset] = useState<number | null>(null);
  const { updateSiteConfig, updateFooter } = useChanges();

  const handlePublishPage = async () => {
    await publishPageAction();
  };

  const handleUnpublishPage = async () => {
    await unpublishPageAction();
  };

  return (
    <div className="flex flex-col gap-6 py-4 animate-in fade-in slide-in-from-left-4 duration-300 no-scrollbar">
      {/* Formularz ustawień globalnych - BEZ action, używamy tylko contextu */}
      <div className="flex flex-col">
        <Collapsible defaultOpen={true}>
          <CollapsibleTrigger className="flex flex-row justify-between mb-5 w-full text-muted-foreground cursor-pointer">
            <Label className="text-xs font-semibold uppercase text-muted-foreground cursor-pointer">
              <Settings2 size={18} />
              Główne ustawienia
            </Label>
            <ArrowDown size={18} />
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col gap-2 mb-4">
            <div className="flex items-center gap-3 p-3 border rounded-md bg-background">
              <div className="space-y-2 w-full">
                <Label htmlFor="app_title" className="text-sm">
                  Tytuł strony
                </Label>
                <Input
                  type="text"
                  name="app_title"
                  onChange={(e) =>
                    updateSiteConfig({ app_title: e.target.value })
                  }
                  defaultValue={initialSiteConfig.app_title}
                  placeholder="Np. Mój Startup"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-md bg-background">
              <div className="space-y-2 w-full">
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
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        updateSiteConfig({ spacing: value });
                      }}
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
          </CollapsibleContent>
        </Collapsible>

        <Collapsible defaultOpen={true}>
          <CollapsibleTrigger className="flex flex-row justify-between mb-5 w-full text-muted-foreground cursor-pointer">
            <Label className="text-xs font-semibold uppercase cursor-pointer">
              <Palette size={18} />
              Wygląd
            </Label>
            <ArrowDown size={18} />
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col gap-2 mb-4">
            <div className="space-y-2">
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
          </CollapsibleContent>
        </Collapsible>
        <Collapsible defaultOpen={true}>
          <CollapsibleTrigger className="flex flex-row justify-between mb-5 w-full text-muted-foreground cursor-pointer">
            <Label className="text-xs font-semibold uppercase text-muted-foreground flex flex-row items-center gap-2 cursor-pointer">
              <PanelBottom size={18} />
              Stopka
            </Label>
            <ArrowDown size={18} />
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col gap-2 mb-4">
            <div className="flex flex-col items-center gap-3 ">
              <div className="space-y-2 w-full p-3 border rounded-md bg-background">
                <Label htmlFor="copyright_text" className="text-sm">
                  Tekst w stopce
                </Label>
                <Input
                  type="text"
                  name="copyright_text"
                  onChange={(e) =>
                    updateFooter({ copyright_text: e.target.value })
                  }
                  defaultValue={initialFooterConfig.copyright_text}
                  placeholder="Np. Mój Startup"
                />
              </div>
              <div className="space-y-2 w-full p-3 border rounded-md bg-background">
                <Label htmlFor="copyright_text" className="text-sm">
                  Email do kontaktu
                </Label>
                <Input
                  type="text"
                  name="email"
                  onChange={(e) => updateFooter({ email: e.target.value })}
                  defaultValue={initialFooterConfig.email}
                  placeholder="Np. Mój Startup"
                />
              </div>
              <div className="space-y-2 w-full p-3 border rounded-md bg-background">
                <Label htmlFor="copyright_text" className="text-sm">
                  Social
                </Label>
                <div className="ml-2 flex flex-col gap-2">
                  {initialFooterConfig.socials_json.socials.map(
                    (social, index: number) => (
                      <div
                        key={index}
                        className="flex flex-col items-center gap-2"
                      >
                        <DropdownSocials icon={social.icon} />
                        <Input
                          type="text"
                          name="social"
                          defaultValue={social.link}
                          placeholder="Np. Mój Startup"
                        />
                        <Separator className="my-2" />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Collapsible defaultOpen={true}>
          <CollapsibleTrigger className="flex flex-row justify-between mb-5 w-full text-muted-foreground cursor-pointer">
            <Label className="text-xs font-semibold uppercase text-muted-foreground flex flex-row items-center gap-2 cursor-pointer">
              <Wrench size={18} />
              WIP
            </Label>
            <ArrowDown size={18} />
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col gap-2 mb-4">
            <div className="flex flex-col items-center gap-3 ">
              <div className="space-y-2 w-full p-3 border rounded-md bg-background">
                <Label htmlFor="main_text" className="text-sm">
                  Tekst główny
                </Label>
                <Input
                  type="text"
                  name="main_text"
                  defaultValue="Stronka w budowie"
                  placeholder="Np. Mój Startup"
                />
              </div>
              <div className="space-y-2 w-full p-3 border rounded-md bg-background">
                <Label htmlFor="desc" className="text-sm">
                  Opis
                </Label>
                <Textarea
                  name="desc"
                  defaultValue="Aktualnie pracujemy nad zawartością strony. Wróć wkrótce!"
                  placeholder="Np. Mój Startup"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

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

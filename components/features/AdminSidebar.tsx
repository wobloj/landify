"use client";

import {
  GripVertical,
  Plus,
  Settings,
  Layers,
  ChevronLeft,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import LogoutButton from "@/components/features/LogoutButton";
import { useState } from "react";
import { SiteConfig } from "@/lib/supabase/data";
import { saveHeroSettings } from "@/app/admin/action";

import { useFormStatus } from "react-dom";

import { Loader2 } from "lucide-react";

import GlobalSettingsView from "./GlobalSettingsView";

import SubmitButton from "./SubmitButton";

interface AdminSidebarProps {
  initialConfig: SiteConfig;
}

export default function AdminSidebar({ initialConfig }: AdminSidebarProps) {
  const [activeTab, setActiveTab] = useState<"sections" | "settings">(
    "settings"
  );

  // Nowy stan do śledzenia, którą sekcję edytujemy (np. "Hero", "Footer" lub null jeśli widok listy)

  const [editingSection, setEditingSection] = useState<string | null>(null);

  const handleSaveHeroSettings = async (formData: FormData) => {
    await saveHeroSettings(formData);
  };

  return (
    <Sidebar className="px-2 border-r border-border">
      <SidebarHeader>
        <div className="flex flex-col gap-4 pt-4">
          <div className="text-center">
            <p className="text-2xl font-bold tracking-tight">Landify CMS</p>

            <p className="text-xs text-muted-foreground">Panel Edycji</p>
          </div>

          <div className="flex flex-row gap-2 bg-muted p-1 rounded-lg">
            <Button
              className={`flex-1 cursor-pointer transition-all ${
                activeTab === "sections"
                  ? "bg-background shadow-sm"
                  : "hover:bg-background/50"
              }`}
              variant="ghost"
              onClick={() => {
                setActiveTab("sections");

                setEditingSection(null); // Reset edycji przy zmianie taba
              }}
            >
              <Layers className="w-4 h-4 mr-2" />
              Sekcje
            </Button>

            <Button
              className={`flex-1 cursor-pointer transition-all ${
                activeTab === "settings"
                  ? "bg-background shadow-sm"
                  : "hover:bg-background/50"
              }`}
              variant="ghost"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="w-4 h-4 mr-2" />
              Ustawienia
            </Button>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* TAB: USTAWIENIA (Globalne) */}

        {activeTab === "settings" && (
          <GlobalSettingsView initialSiteConfig={initialConfig} />
        )}

        {/* TAB: SEKCJE */}

        {activeTab === "sections" && (
          <div className="flex flex-col gap-6 py-4 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* WIDOK LISTY SEKCJI (Gdy nic nie jest edytowane) */}

            {!editingSection && (
              <>
                <SidebarGroup>
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-3">
                    Układ strony
                  </p>

                  <p className="text-xs text-muted-foreground mb-4">
                    Kliknij w sekcję, aby ją edytować.
                  </p>

                  <div className="flex flex-col gap-2">
                    {["hero", "features", "cta"].map((section, i) => (
                      <div
                        key={i}
                        onClick={() => setEditingSection(section)}
                        className="group flex items-center justify-between p-3 bg-background border rounded-md shadow-sm hover:border-primary/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <GripVertical
                            className="w-4 h-4 text-muted-foreground cursor-grab active:cursor-grabbing"
                            onClick={(e) => e.stopPropagation()}
                          />

                          <span className="font-medium text-sm">
                            {section.toUpperCase()}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Edit className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                </SidebarGroup>

                <SidebarGroup>
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-3">
                    Dostępne komponenty
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {["Hero", "Features", "CTA", "Footer"].map((item) => (
                      <Button
                        key={item}
                        variant="outline"
                        className="justify-start h-auto py-2 px-3"
                        size="sm"
                      >
                        <Plus className="w-3 h-3 mr-2 text-muted-foreground" />

                        {item}
                      </Button>
                    ))}
                  </div>
                </SidebarGroup>
              </>
            )}

            {/* WIDOK EDYCJI: HERO */}

            {editingSection === "hero" && (
              <div className="animate-in slide-in-from-right-8 duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <Button
                    variant="ghost"
                    onClick={() => setEditingSection(null)}
                  >
                    <>
                      <ChevronLeft className="w-4 h-4" />

                      <span className="font-semibold text-sm">
                        Edycja: Hero
                      </span>
                    </>
                  </Button>
                </div>

                <form action={handleSaveHeroSettings}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="hero_title">Nagłówek</Label>

                      <Input
                        id="hero_title"
                        name="hero_title"
                        defaultValue={initialConfig.hero_title}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hero_subtitle">Podtytuł</Label>

                      <Textarea
                        id="hero_subtitle"
                        name="hero_subtitle"
                        className="h-20 resize-none"
                        defaultValue={initialConfig.hero_subtitle}
                      />
                    </div>

                    <div className="pt-4 border-t">
                      <SubmitButton className="w-full" size="sm">
                        Zapisz zmiany w Hero
                      </SubmitButton>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* WIDOK EDYCJI: Placeholder dla innych sekcji */}

            {editingSection && editingSection !== "Hero" && (
              <div className="animate-in slide-in-from-right-8 duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingSection(null)}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <span className="font-semibold text-sm">
                    Edycja: {editingSection}
                  </span>
                </div>

                <div className="p-4 border border-dashed rounded-md text-center text-sm text-muted-foreground">
                  Tutaj pojawią się opcje edycji dla sekcji {editingSection}.
                </div>
              </div>
            )}
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t p-4 bg-background/50">
        <div className="flex">
          <LogoutButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

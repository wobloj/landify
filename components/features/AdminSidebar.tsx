"use client";
import { Settings, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import LogoutButton from "@/components/features/LogoutButton";
import { useState } from "react";
import { SectionConfig, SiteConfig } from "@/lib/supabase/data";
import GlobalSettingsView from "./GlobalSettingsView";
import SectionSettingsView from "./SectionSettingsView";
import DarkModeSwitch from "./DarkModeSwitch";

interface AdminSidebarProps {
  initialConfigSite: SiteConfig;
  initialConfigSection: SectionConfig[];
}

export default function AdminSidebar({
  initialConfigSite,
  initialConfigSection,
}: AdminSidebarProps) {
  const [activeTab, setActiveTab] = useState<"sections" | "settings">(
    "sections"
  );
  const [editingSection, setEditingSection] = useState<string | null>(null);

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader>
        <div className="flex flex-col gap-4 pt-4">
          <DarkModeSwitch />
          <div className="text-center">
            <p className="text-2xl font-bold tracking-tight">Landify CMS</p>

            <p className="text-xs text-muted-foreground">Panel Edycji</p>
          </div>

          <div className="flex flex-row gap-2 p-1 rounded-lg">
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
          <GlobalSettingsView initialSiteConfig={initialConfigSite} />
        )}

        {/* TAB: SEKCJE */}

        {activeTab === "sections" && (
          <SectionSettingsView initialConfigSection={initialConfigSection} />
        )}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex">
          <LogoutButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

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
import { useState, useEffect } from "react";
import GlobalSettingsView from "./GlobalSettingsView";
import SectionSettingsView from "./SectionSettingsView";
import DarkModeSwitch from "./DarkModeSwitch";
import { FooterConfig, SectionConfig, SiteConfig } from "@/lib/types/types";
import Link from "next/link";
import { useSectionSelection } from "@/context/SectionSelectionContext";

interface AdminSidebarProps {
  initialConfigSite: SiteConfig;
  initialConfigSection: SectionConfig[];
  initialConfigFooter?: FooterConfig;
}

export default function AdminSidebar({
  initialConfigSite,
  initialConfigSection,
  initialConfigFooter,
}: AdminSidebarProps) {
  const [activeTab, setActiveTab] = useState<"sections" | "settings">(
    "sections"
  );
  const { selectedSection } = useSectionSelection();

  // Automatycznie przełącz na tab "sections" gdy użytkownik kliknie sekcję
  useEffect(() => {
    if (selectedSection) {
      setActiveTab("sections");
    }
  }, [selectedSection]);

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader>
        <div className="flex flex-col gap-4 pt-4">
          <DarkModeSwitch />
          <div className="text-center">
            <Link href="/">
              <p className="text-2xl font-bold tracking-tight">Landify CMS</p>
            </Link>
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
          <GlobalSettingsView
            initialSiteConfig={initialConfigSite}
            initialFooterConfig={initialConfigFooter}
          />
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

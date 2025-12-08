import { Edit, GripVertical, Plus } from "lucide-react";
import { SidebarGroup } from "../ui/sidebar";
import { Button } from "../ui/button";
import { useState } from "react";
import HeroEditor from "./editors/HeroEditor";
import FeaturesEditor from "./editors/FeaturesEditor";
import CtaEditor from "./editors/CtaEditor";
import { SectionConfig } from "@/lib/supabase/data";

interface SectionSettingsProps {
  initialConfigSection: SectionConfig[];
}

export default function SectionSettingsView({
  initialConfigSection,
}: SectionSettingsProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const heroData = initialConfigSection["hero"];
  const featuresData = initialConfigSection["features"];
  const ctaData = initialConfigSection["cta"];
  return (
    <div className="flex flex-col gap-6 py-4 animate-in fade-in slide-in-from-right-4 duration-300">
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

      {editingSection === "hero" && (
        <HeroEditor
          heroData={heroData}
          onClick={() => setEditingSection(null)}
        />
      )}

      {editingSection === "features" && (
        <FeaturesEditor
          featuresData={featuresData}
          onClick={() => setEditingSection(null)}
        />
      )}

      {editingSection === "cta" && (
        <CtaEditor ctaData={ctaData} onClick={() => setEditingSection(null)} />
      )}
    </div>
  );
}

import { Plus } from "lucide-react";
import { SidebarGroup } from "../ui/sidebar";
import { Button } from "../ui/button";
import { useState } from "react";
import HeroEditor from "./editors/HeroEditor";
import FeaturesEditor from "./editors/FeaturesEditor";
import CtaEditor from "./editors/CtaEditor";
import { SectionConfig } from "@/lib/supabase/data";
import SortableSectionList from "./SortableSectionList";

interface SectionSettingsProps {
  initialConfigSection: SectionConfig[];
}

export default function SectionSettingsView({
  initialConfigSection,
}: SectionSettingsProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const initialSections = Object.keys(initialConfigSection).sort(
    (a, b) =>
      (initialConfigSection[a].sort_order ?? 0) -
      (initialConfigSection[b].sort_order ?? 0)
  );

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

            <SortableSectionList
              initialSections={initialSections}
              setEditingSection={setEditingSection}
            />
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

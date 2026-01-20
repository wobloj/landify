import { Check, Plus } from "lucide-react";
import { SidebarGroup } from "../ui/sidebar";
import { Button } from "../ui/button";
import HeroEditor from "./editors/HeroEditor";
import FeaturesEditor from "./editors/FeaturesEditor";
import CtaEditor from "./editors/CtaEditor";
import SortableSectionList from "./SortableSectionList";
import { SectionConfig } from "@/lib/types/types";
import { AVAILABLE_SECTIONS } from "@/lib/consts/sections";
import { addSection } from "@/app/admin/action";
import { VideoEditor } from "./editors/VideoEditor";
import { ImagesEditor } from "./editors/ImageEditor";
import { BlankEditor } from "./editors/BlankEditor";
import { useSectionSelection } from "@/context/SectionSelectionContext";

interface SectionSettingsProps {
  initialConfigSection: SectionConfig[];
}

export default function SectionSettingsView({
  initialConfigSection,
}: SectionSettingsProps) {
  // Używamy context zamiast lokalnego state
  const { selectedSection, setSelectedSection, scrollToSection } =
    useSectionSelection();

  const initialSections = Object.values(initialConfigSection)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((section) => ({
      id: section.id,
      section_type: section.section_type,
      is_deleted: section.is_deleted,
    }));

  const enabledSections = new Set(
    initialSections.filter((s) => !s.is_deleted).map((s) => s.section_type)
  );

  const heroData = initialConfigSection["hero"];
  const featuresData = initialConfigSection["features"];
  const ctaData = initialConfigSection["cta"];
  const videoData = initialConfigSection["video"];
  const imageData = initialConfigSection["images"];
  const blankData = initialConfigSection["blank"];

  return (
    <div className="flex flex-col gap-6 py-4 animate-in fade-in slide-in-from-right-4 duration-300">
      {!selectedSection && (
        <>
          <SidebarGroup>
            <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">
              Układ strony
            </p>

            <p className="text-xs text-muted-foreground mb-4">
              Kliknij w sekcję, aby ją edytować.
            </p>

            <SortableSectionList
              initialSections={initialSections}
              setEditingSection={setSelectedSection}
            />
          </SidebarGroup>
          <SidebarGroup>
            <p className="text-xs font-semibold uppercase text-muted-foreground mb-3">
              Sekcje
            </p>

            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_SECTIONS.map((item) => {
                const isEnabled = enabledSections.has(item.type);

                return (
                  <Button
                    key={item.type}
                    variant="outline"
                    size="sm"
                    disabled={isEnabled}
                    className={`
            justify-start h-auto py-2 px-3
            ${isEnabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
                    onClick={async () => {
                      if (!isEnabled) {
                        await addSection(item.type);
                      }
                    }}
                  >
                    {isEnabled ? (
                      <Check className="w-3 h-3 mr-2 text-green-500" />
                    ) : (
                      <Plus className="w-3 h-3 mr-2 text-muted-foreground" />
                    )}

                    {item.label}
                  </Button>
                );
              })}
            </div>
          </SidebarGroup>
        </>
      )}

      {selectedSection === "hero" && (
        <HeroEditor
          heroData={heroData}
          onClick={() => setSelectedSection(null)}
        />
      )}

      {selectedSection === "features" && (
        <FeaturesEditor
          featuresData={featuresData}
          onClick={() => setSelectedSection(null)}
        />
      )}

      {selectedSection === "cta" && (
        <CtaEditor ctaData={ctaData} onClick={() => setSelectedSection(null)} />
      )}

      {selectedSection === "video" && (
        <VideoEditor
          videoData={videoData}
          onClick={() => setSelectedSection(null)}
        />
      )}

      {selectedSection === "images" && (
        <ImagesEditor
          imageData={imageData}
          onClick={() => setSelectedSection(null)}
        />
      )}

      {selectedSection === "blank" && (
        <BlankEditor
          blankData={blankData}
          onClick={() => setSelectedSection(null)}
        />
      )}
    </div>
  );
}

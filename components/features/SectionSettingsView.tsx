import { Check, Plus } from "lucide-react";
import { SidebarGroup } from "../ui/sidebar";
import { Button } from "../ui/button";
import HeroEditor from "./editors/HeroEditor";
import FeaturesEditor from "./editors/FeaturesEditor";
import CtaEditor from "./editors/CtaEditor";
import SortableSectionList from "./SortableSectionList";
import { SectionConfig } from "@/lib/types/types";
import { AVAILABLE_SECTIONS } from "@/lib/consts/sections";
import { addSection } from "@/app/admin/actions";
import { VideoEditor } from "./editors/VideoEditor";
import { ImagesEditor } from "./editors/ImageEditor";
import { BlankEditor } from "./editors/BlankEditor";
import { useSectionSelection } from "@/context/SectionSelectionContext";
import { useChanges } from "@/context/ChangesContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import CustomEditor from "./editors/CustomEditor";

interface SectionSettingsProps {
  initialConfigSection: SectionConfig[];
}

export default function SectionSettingsView({
  initialConfigSection,
}: SectionSettingsProps) {
  // Używamy context zamiast lokalnego state
  const { selectedSection, setSelectedSection } = useSectionSelection();

  // Pobierz siteId z ChangesContext
  const { siteId } = useChanges();
  const router = useRouter();
  const { toast } = useToast();
  const [addingSectionType, setAddingSectionType] = useState<string | null>(
    null,
  );

  const sectionsArray: SectionConfig[] = Array.isArray(initialConfigSection)
    ? initialConfigSection
    : Object.values(initialConfigSection || {});

  const initialSections = sectionsArray
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((section) => ({
      id: section.id,
      section_type: section.section_type,
      is_deleted: section.is_deleted,
    }));

  const enabledSections = new Set(
    initialSections.filter((s) => !s.is_deleted).map((s) => s.section_type),
  );

  const getSection = (type: string) =>
    sectionsArray.find((s) => s.section_type === type) ||
    ({
      id: 0,
      section_type: type as string,
      sort_order: 0,
      title: "",
      image_url: null,
      data_json: {},
      is_deleted: true,
      updated_at: new Date().toISOString(),
    } as SectionConfig);

  const heroData = getSection("hero");
  const featuresData = getSection("features");
  const ctaData = getSection("cta");
  const videoData = getSection("video");
  const imageData = getSection("images");
  const blankData = getSection("blank");

  const handleAddSection = async (sectionType: string) => {
    if (!siteId) {
      toast({
        title: "Błąd",
        description: "Nie znaleziono aktywnej strony",
        variant: "destructive",
      });
      return;
    }

    setAddingSectionType(sectionType);

    try {
      const result = await addSection(sectionType, siteId);

      if (result.success) {
        toast({
          title: "Sukces",
          description: "Sekcja została dodana",
        });

        // Odśwież stronę aby załadować nową sekcję
        router.refresh();
      } else {
        toast({
          title: "Błąd",
          description: result.message || "Nie udało się dodać sekcji",
          variant: "destructive",
        });
      }
    } catch (error: unkown) {
      console.error("Błąd podczas dodawania sekcji:", error);
      toast({
        title: "Błąd",
        description: error.message || "Wystąpił nieoczekiwany błąd",
        variant: "destructive",
      });
    } finally {
      setAddingSectionType(null);
    }
  };

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
                const isAdding = addingSectionType === item.type;

                return (
                  <Button
                    key={item.type}
                    variant="outline"
                    size="sm"
                    disabled={isEnabled || isAdding}
                    className={`
                      justify-start h-auto py-2 px-3
                      ${isEnabled ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                    onClick={() => {
                      if (!isEnabled && !isAdding) {
                        handleAddSection(item.type);
                      }
                    }}
                  >
                    {isAdding ? (
                      <div className="w-3 h-3 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : isEnabled ? (
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
        <CustomEditor
          blankData={blankData}
          onClick={() => setSelectedSection(null)}
        />
      )}
    </div>
  );
}

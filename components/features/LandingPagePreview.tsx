"use client";

import { FooterConfig, SectionConfig, SiteConfig } from "@/lib/types/types";
import Hero from "@/components/features/site/Hero";
import Features from "./site/Features";
import Cta from "./site/Cta";
import Video from "./site/Video";
import Images from "./site/Images";
import Blank from "./site/Blank";
import Footer from "./site/Footer";
import { ClickableSectionWrapper } from "./ClickableSelectionWrapper";
import { useChanges } from "@/context/ChangesContext";
import { useMemo } from "react";
import {
  mergeSiteConfig,
  mergeSectionData,
  mergeFooterData,
  getSectionOrder,
} from "@/lib/utils/mergePreviewData";

interface LandingPagePreviewProps {
  configSite: SiteConfig;
  configSections: SectionConfig;
  configFooter: FooterConfig;
}

export function LandingPagePreview({
  configSite: initialConfigSite,
  configSections: initialConfigSections,
  configFooter: initialConfigFooter,
}: LandingPagePreviewProps) {
  const { changes } = useChanges();

  // Merguj globalne ustawienia ze zmianami
  const configSite = useMemo(
    () => mergeSiteConfig(initialConfigSite, changes.siteConfig),
    [initialConfigSite, changes.siteConfig],
  );

  // Merguj footer ze zmianami
  const configFooter = useMemo(
    () => mergeFooterData(initialConfigFooter, changes.footer),
    [initialConfigFooter, changes.footer],
  );

  // Przekonwertuj object na array dla funkcji getSectionOrder
  const sectionsArray = useMemo(
    () => Object.values(initialConfigSections),
    [initialConfigSections],
  );

  // Pobierz aktualną kolejność sekcji
  const orderedSectionsArray = useMemo(
    () => getSectionOrder(sectionsArray, changes),
    [sectionsArray, changes],
  );

  // Filtruj i merguj sekcje
  const orderedSections = useMemo(() => {
    return orderedSectionsArray
      .filter((section) => !section.is_deleted)
      .map((section) => {
        // Merguj dane sekcji ze zmianami
        const mergedSection = mergeSectionData(section, changes.sections);
        return [section.section_type, mergedSection] as const;
      });
  }, [orderedSectionsArray, changes.sections]);

  return (
    <div
      className="min-h-screen font-sans w-full flex flex-col"
      style={{ backgroundColor: configSite.bg_color, gap: configSite.spacing }}
    >
      <header
        className="py-4"
        style={{
          color: configSite.text_color_primary,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1
            className="text-2xl font-bold"
            style={{ color: configSite.text_color_primary }}
          >
            {configSite.app_title}
          </h1>
        </div>
      </header>

      {orderedSections.map(([key, section]) => {
        switch (key) {
          case "hero":
            return (
              <ClickableSectionWrapper sectionType="hero" key="hero">
                <Hero section={section} configSite={configSite} />
              </ClickableSectionWrapper>
            );

          case "features":
            return (
              <ClickableSectionWrapper sectionType="features" key="features">
                <Features section={section} configSite={configSite} />
              </ClickableSectionWrapper>
            );

          case "cta":
            return (
              <ClickableSectionWrapper sectionType="cta" key="cta">
                <Cta section={section} configSite={configSite} />
              </ClickableSectionWrapper>
            );

          case "images":
            return (
              <ClickableSectionWrapper sectionType="images" key="images">
                <Images section={section} configSite={configSite} />
              </ClickableSectionWrapper>
            );

          case "video":
            return (
              <ClickableSectionWrapper sectionType="video" key="video">
                <Video section={section} configSite={configSite} />
              </ClickableSectionWrapper>
            );

          case "blank":
            return (
              <ClickableSectionWrapper sectionType="blank" key="blank">
                <Blank section={section} configSite={configSite} />
              </ClickableSectionWrapper>
            );

          default:
            return null;
        }
      })}

      <div>
        <Footer configFooter={configFooter} configSite={configSite} />
      </div>
    </div>
  );
}

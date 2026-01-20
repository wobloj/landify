import { FooterConfig, SectionConfig, SiteConfig } from "@/lib/types/types";
import Hero from "@/components/features/site/Hero";
import Features from "./site/Features";
import Cta from "./site/Cta";
import Video from "./site/Video";
import Images from "./site/Images";
import Blank from "./site/Blank";
import Footer from "./site/Footer";

type FullSiteProps = {
  configSite: SiteConfig;
  configFooter: FooterConfig;
  configSections: SectionConfig;
};

export default function FullSite({
  configSite,
  configFooter,
  configSections,
}: FullSiteProps) {
  const orderedSections = Object.entries(configSections)
    .filter(([, section]) => !section.is_deleted)
    .sort(([, a], [, b]) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  return (
    <div
      className={`min-h-screen font-sans w-full flex flex-col`}
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
              <Hero key={"hero"} section={section} configSite={configSite} />
            );

          case "features":
            return (
              <Features
                key={"features"}
                section={section}
                configSite={configSite}
              />
            );

          case "cta":
            return (
              <Cta key={"cta"} section={section} configSite={configSite} />
            );

          case "images":
            return (
              <Images
                key={"images"}
                section={section}
                configSite={configSite}
              />
            );

          case "video":
            return (
              <Video key={"video"} section={section} configSite={configSite} />
            );

          case "blank":
            return (
              <Blank key={"blank"} section={section} configSite={configSite} />
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

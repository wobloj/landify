"use client";

import { SectionConfig, SiteConfig } from "@/lib/types/types";
import { ClickableSectionWrapper } from "../ClickableSelectionWrapper";

type VideoProps = {
  section: SectionConfig;
  configSite: SiteConfig;
};

export default function Video({ section, configSite }: VideoProps) {
  const urlConverter = (url: string) => {
    const urlParts = url.split("=");
    if (urlParts.length > 1) {
      return `https://www.youtube.com/embed/${urlParts[1]}`;
    } else {
      return url;
    }
  };

  return (
    <section key="video" className="text-center">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-5">
          <h2
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
            style={{ color: configSite.text_color_primary }}
          >
            {section?.title}
          </h2>
          <p
            className="mt-2"
            style={{ color: configSite.text_color_secondary }}
          >
            {section?.data_json.desc}
          </p>
        </div>
        <div className="flex flex-col place-items-center">
          <iframe
            width="720"
            src={urlConverter(section?.data_json.url)}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="aspect-video"
          ></iframe>
        </div>
      </div>
    </section>
  );
}

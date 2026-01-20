"use client";

import { SectionConfig, SiteConfig } from "@/lib/types/types";

type BlankProps = {
  section: SectionConfig;
  configSite: SiteConfig;
};
export default function Blank({ section, configSite }: BlankProps) {
  return (
    <section className="text-center">
      <div className="max-w-4xl mx-auto w-1/2 p-4">
        <div className="mb-5">
          <h2
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
            style={{ color: configSite.text_color_primary }}
          >
            {section?.title}
          </h2>
          <p
            className="text-xl tracking-tight sm:text-base"
            style={{ color: configSite.text_color_secondary }}
          >
            {section?.data_json.desc}
          </p>
        </div>
        <div className={`grid grid-cols-${section?.data_json.columns.length}`}>
          {section?.data_json?.columns.map((col: string, index: number) => (
            <div key={index} style={{ color: configSite.text_color_primary }}>
              {col}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

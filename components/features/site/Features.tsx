"use client";

import { icons } from "@/lib/consts/icons";
import { SectionConfig, SiteConfig } from "@/lib/types/types";

type FeaturesProps = {
  section: SectionConfig;
  configSite: SiteConfig;
};

function FeatureItem({ item, borderColor, textColor }: any) {
  const Icon = icons[item.icon];

  return (
    <div
      style={{ borderColor: borderColor }}
      className="flex flex-col px-8 gap-3 border-2 rounded-md w-full py-4 transition-colors hover:bg-accent/15"
    >
      <div className="text-start w-full">
        {Icon && (
          <Icon
            style={{ color: textColor }}
            className="size-10 p-1 rounded-xs "
          />
        )}
      </div>
      <div className="text-start">
        <h3 className="font-bold text-2xl mb-4">{item.title}</h3>
        <p className="text-gray-600 text-base">{item.desc}</p>
      </div>
    </div>
  );
}

export default function Features({ section, configSite }: FeaturesProps) {
  return (
    <section key="features" className="text-center mx-10">
      <div className="mx-auto p-4">
        <div className=" mb-12">
          <h2
            className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-5"
            style={{ color: configSite.text_color_primary }}
          >
            {section?.title}
          </h2>
          <p
            className="text-xl"
            style={{ color: configSite.text_color_secondary }}
          >
            {section.data_json?.sectionDescription}
          </p>
        </div>

        <div
          className="grid sm:grid-cols-3 grid-cols-1 gap-16 place-items-stretch"
          style={{ color: configSite.text_color_primary }}
        >
          {section?.data_json?.items?.map((item: any) => (
            <FeatureItem
              key={item.title}
              item={item}
              borderColor={configSite.text_color_secondary}
              textColor={configSite.primary_color}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

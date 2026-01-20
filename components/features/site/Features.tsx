"use client";

import { icons } from "@/lib/consts/icons";
import { SectionConfig, SiteConfig } from "@/lib/types/types";

type FeaturesProps = {
  section: SectionConfig;
  configSite: SiteConfig;
};

function FeatureItem({ item }: any) {
  const Icon = icons[item.icon];

  return (
    <div className="flex flex-col gap-3 items-center rounded-md w-full py-2 transition-colors hover:bg-accent-foreground/15">
      {Icon && <Icon className="size-8" />}
      <div>
        <h3 className="font-bold text-2xl mb-4">{item.title}</h3>
        <p className="text-gray-600 text-base">{item.desc}</p>
      </div>
    </div>
  );
}

export default function Features({ section, configSite }: FeaturesProps) {
  return (
    <section key="features" className="text-center">
      <div className="max-w-4xl mx-auto p-4">
        <h2
          className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-12"
          style={{ color: configSite.text_color_primary }}
        >
          {section?.title}
        </h2>
        <div
          className="grid grid-cols-3 gap-16 place-items-stretch"
          style={{ color: configSite.text_color_primary }}
        >
          {section?.data_json?.items?.map((item: any) => (
            <FeatureItem key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

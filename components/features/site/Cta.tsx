"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SectionConfig, SiteConfig } from "@/lib/types/types";

type CtaProps = {
  section: SectionConfig;
  configSite: SiteConfig;
};

export default function Cta({ section, configSite }: CtaProps) {
  return (
    <section key="cta" className="text-center">
      <div className="max-w-4xl mx-auto w-1/2 p-4">
        <h2
          className="text-3xl font-extrabold tracking-tight sm:text-4xl"
          style={{ color: configSite.text_color_primary }}
        >
          {section?.title}
        </h2>
        <p className="mt-2" style={{ color: configSite.text_color_secondary }}>
          {section?.data_json.desc}
        </p>
        <Textarea
          className="my-6 min-h-36"
          style={{ background: configSite.secondary_color }}
        ></Textarea>
        <Button
          size="lg"
          className="shadow-xl text-white hover:opacity-90 cursor-pointer min-w-32"
          style={{ backgroundColor: configSite.primary_color }}
        >
          {section?.data_json.button_text}
        </Button>
      </div>
    </section>
  );
}

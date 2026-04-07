"use client";

import { SectionConfig, SiteConfig } from "@/lib/types/types";
import Image from "next/image";
import image from "@/public/photo1.jpeg";

type HeroProps = {
  section: SectionConfig;
  configSite: SiteConfig;
};

export default function Hero({ section, configSite }: HeroProps) {
  return (
    <section className="text-center flex flex-row gap-5 items-center">
      <div className="max-w-4xl mx-auto p-4">
        <h2
          className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6"
          style={{ color: configSite.text_color_primary }}
        >
          {section?.title}
        </h2>

        <p
          className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto"
          style={{ color: configSite.text_color_secondary }}
        >
          {section?.data_json.subtitle}
        </p>
      </div>
      <div>
        <Image
          src={image}
          alt="Hero Image"
          height={600}
          className="rounded-md mt-4 aspect-video"
        />
      </div>
    </section>
  );
}

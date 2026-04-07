import { SiteConfig } from "@/lib/types/types";

export default function Header({ configSite }: { configSite: SiteConfig }) {
  return (
    <header
      className="py-4 border-accent/60"
      style={{
        color: configSite.text_color_primary,
      }}
    >
      <div className="px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <h1
          className="text-3xl font-bold"
          style={{ color: configSite.text_color_primary }}
        >
          {configSite.app_title}
        </h1>
      </div>
    </header>
  );
}

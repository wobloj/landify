import {
  SiteConfig,
  SectionConfig,
  getSectionConfig,
} from "@/lib/supabase/data";
import { Button } from "@/components/ui/button";

export async function LandingPagePreview({
  configSite,
}: {
  configSite: SiteConfig;
}) {
  const configSection = await getSectionConfig("hero");
  const style = {
    "--primary-color": configSite.primary_color,
  } as React.CSSProperties;

  return (
    <div
      className="min-h-screen bg-white font-sans text-slate-900 w-full"
      style={{ backgroundColor: configSite.bg_color }}
    >
      {/* Header */}

      <header
        className="py-4 shadow-sm border-b-2"
        style={{
          borderColor: configSite.primary_color,
          color: configSite.text_color,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1
            className="text-2xl font-bold"
            style={{ color: configSite.primary_color }}
          >
            {configSite.app_title}
          </h1>
        </div>
      </header>

      {/* Hero Section */}

      <section
        className="text-center py-20 md:py-32 bg-gray-50"
        style={{ color: configSite.text_color }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <h2
            className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6"
            style={{ color: configSite.primary_color }}
          >
            {configSection.title}
          </h2>

          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            {configSection?.data_json.subtitle}
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Button
              size="lg"
              className="shadow-xl text-white hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: configSite.primary_color }}
            >
              Zacznij Teraz
            </Button>

            <Button
              className=" cursor-pointer"
              size="lg"
              style={{ backgroundColor: configSite.secondary_color }}
              variant="outline"
            >
              Dowiedz się więcej
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

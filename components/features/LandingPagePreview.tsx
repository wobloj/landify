import { SectionConfig, SiteConfig } from "@/lib/supabase/data";
import { Button } from "@/components/ui/button";
import { icons } from "@/lib/consts/icons";

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

export async function LandingPagePreview({
  configSite,
  configSections,
}: {
  configSite: SiteConfig;
  configSections: SectionConfig;
}) {
  const orderedSections = Object.entries(configSections).sort(
    ([, a], [, b]) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );

  return (
    <div
      className="min-h-screen font-sans text-slate-900 w-full"
      style={{ backgroundColor: configSite.bg_color }}
    >
      <header
        className="py-4 border-b-2"
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

      {orderedSections.map(([key, section]) => {
        switch (key) {
          case "hero":
            return (
              <section
                key="hero"
                className="text-center py-20 md:py-32"
                style={{ color: configSite.text_color }}
              >
                <div className="max-w-4xl mx-auto px-4">
                  <h2
                    className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6"
                    style={{ color: configSite.primary_color }}
                  >
                    {section?.title}
                  </h2>

                  <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                    {section?.data_json.subtitle}
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
                      className="cursor-pointer"
                      size="lg"
                      style={{ backgroundColor: configSite.secondary_color }}
                      variant="outline"
                    >
                      Dowiedz się więcej
                    </Button>
                  </div>
                </div>
              </section>
            );

          case "features":
            return (
              <section
                key="features"
                className="text-center py-20 md:py-32"
                style={{ color: configSite.text_color }}
              >
                <div className="max-w-4xl mx-auto px-4">
                  <h2
                    className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-12"
                    style={{ color: configSite.primary_color }}
                  >
                    {section?.title}
                  </h2>
                  <div className="grid grid-cols-3 gap-16 place-items-stretch">
                    {section?.data_json?.items?.map((item: any) => (
                      <FeatureItem key={item.title} item={item} />
                    ))}
                  </div>
                </div>
              </section>
            );

          case "cta":
            return (
              <section
                key="cta"
                className="text-center py-20 md:py-32"
                style={{ color: configSite.text_color }}
              >
                <div className="max-w-4xl mx-auto px-4">
                  <h2
                    className="text-3xl font-extrabold tracking-tight sm:text-4xl"
                    style={{ color: configSite.primary_color }}
                  >
                    {section?.title}
                  </h2>
                  <p className="text-muted-foreground mt-2 mb-6">
                    {section?.data_json.desc}
                  </p>
                  <Button
                    size="lg"
                    className="shadow-xl text-white hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: configSite.primary_color }}
                  >
                    {section?.data_json.button_text}
                  </Button>
                </div>
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

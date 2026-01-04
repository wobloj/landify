import { FooterConfig, SectionConfig, SiteConfig } from "@/lib/supabase/data";
import { Button } from "@/components/ui/button";
import { icons } from "@/lib/consts/icons";
import { Textarea } from "../ui/textarea";

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
  configFooter,
}: {
  configSite: SiteConfig;
  configSections: SectionConfig;
  configFooter: FooterConfig;
}) {
  const orderedSections = Object.entries(configSections).sort(
    ([, a], [, b]) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center rounded-md hover:outline-dashed hover:outline-2 hover:bg-primary/10 cursor-pointer">
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
              <div key="hero">
                <section className="text-center">
                  <div className="max-w-4xl mx-auto px-4 rounded-md hover:outline-dashed hover:outline-2 hover:bg-primary/10 cursor-pointer">
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
                </section>
              </div>
            );

          case "features":
            return (
              <section key="features" className="text-center">
                <div className="max-w-4xl mx-auto px-4 rounded-md hover:outline-dashed hover:outline-2 hover:bg-primary/10 cursor-pointer">
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

          case "cta":
            return (
              <section key="cta" className="text-center">
                <div className="max-w-4xl mx-auto p-4 rounded-md hover:outline-dashed hover:outline-2 hover:bg-primary/10 cursor-pointer">
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

          default:
            return null;
        }
      })}
      <div>
        <footer
          className="py-6 mt-12"
          style={{ color: configSite.text_color_primary }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center rounded-md hover:outline-dashed hover:outline-2 hover:bg-primary/10 cursor-pointer">
            <p style={{ color: configSite.text_color_primary }}>
              {configFooter.copyright_text}
            </p>
            <p style={{ color: configSite.text_color_secondary }}>
              {configFooter.email}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

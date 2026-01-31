import { socialIcons } from "@/lib/consts/socialIcons";
import { FooterConfig, SiteConfig } from "@/lib/types/types";

type FooterProps = {
  configFooter: FooterConfig;
  configSite: SiteConfig;
};

function SocialItem({ item }: any) {
  const Icon = socialIcons[item.icon];

  return (
    <div className="items-center rounded-md w-full transition-colors">
      <div>
        <a
          target="_blank"
          href={item.link}
          className="flex flex-row items-center gap-2 text-sm hover:underline"
        >
          {Icon && <Icon className="size-4" />}
          {item.social_name}
        </a>
      </div>
    </div>
  );
}

export default function Footer({ configFooter, configSite }: FooterProps) {
  return (
    <footer
      className="py-6 mt-12 grid grid-cols-2 place-items-center"
      style={{ color: configSite.text_color_primary }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <p style={{ color: configSite.text_color_primary }}>
          {configFooter.copyright_text} &#169; {new Date().getFullYear()}
        </p>
        <p style={{ color: configSite.text_color_secondary }}>
          {configFooter.email}
        </p>
      </div>
      <div className="flex flex-row gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {configFooter?.socials_json?.socials?.map((item: any) => (
          <SocialItem key={item.social_name} item={item} />
        ))}
      </div>
    </footer>
  );
}

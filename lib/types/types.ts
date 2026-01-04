export type HeroType = {
  id: number;
  section_type: string;
  sort_order: number;
  title: string;
  data_json: {
    subtitle: string;
  };
  image?: string;
};

export type FeaturesType = {
  id: number;
  section_type: string;
  sort_order: number;
  title: string;
  data_json: {
    items: {
      desc: string;
      icon: string;
      title: string;
    };
  };
  image?: string;
};

export type CtaType = {
  id: number;
  section_type: string;
  sort_order: number;
  title: string;
  data_json: {
    desc: string;
    button_text: string;
  };
  image?: string;
};

export type SectionType = "hero" | "features" | "cta";

export type SiteConfig = {
  id: number;
  app_title: string;
  is_published: boolean;
  primary_color: string;
  secondary_color: string;
  bg_color: string;
  text_color_primary: string;
  text_color_secondary: string;
  spacing: number;
  logo_url: string;
  updated_at: string;
};

export type SectionConfig = {
  id: number;
  section_type: SectionType;
  sort_order: number;
  title: string;
  image_url: string | null;
  data_json: Record<string, any>;
  updated_at: string;
};

export type FooterConfig = {
  id: number;
  email: string;
  copyright_text: string;
};

export type SiteConfigChanges = Partial<
  Omit<SiteConfig, "spacing"> & {
    spacing: number; // W contextcie używamy number, konwersja na "16px" odbywa się przed zapisem
  }
>;

export type ChangeSet = {
  siteConfig?: SiteConfigChanges;
  sections?: {
    [sectionType: string]: {
      title?: string;
      image_url?: string | null;
      data_json?: Record<string, any>;
    };
  };
  footer?: {
    email?: string;
    copyright_text?: string;
  };
  sectionOrder?: string[];
};

export type SaveResult = {
  success: boolean;
  message: string;
  savedChanges?: {
    siteConfig?: boolean;
    sections?: string[];
    footer?: boolean;
    sectionOrder?: boolean;
  };
};

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

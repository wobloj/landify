import {
  Facebook,
  Instagram,
  Github,
  LucideProps,
  Youtube,
} from "lucide-react";
import { type ComponentType } from "react";

export type IconName = "facebook" | "instagram" | "github" | "youtube";

export const socialIcons: Record<IconName, ComponentType<LucideProps>> = {
  facebook: Facebook,
  instagram: Instagram,
  github: Github,
  youtube: Youtube,
};

export const iconOptions = [
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "github", label: "Github", icon: Github },
  { value: "youtube", label: "Youtube", icon: Youtube },
];

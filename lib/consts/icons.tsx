import { Sun, Smile, Pen, LucideProps, Moon } from "lucide-react";
import { type ComponentType } from "react";

export type IconName = "sun" | "smile" | "pen" | "moon";

export const icons: Record<IconName, ComponentType<LucideProps>> = {
  sun: Sun,
  smile: Smile,
  pen: Pen,
  moon: Moon,
};

export const iconOptions = [
  { value: "sun", label: "Słońce", icon: Sun },
  { value: "smile", label: "Uśmiech", icon: Smile },
  { value: "pen", label: "Ołówek", icon: Pen },
  { value: "moon", label: "Księżyc", icon: Moon },
];

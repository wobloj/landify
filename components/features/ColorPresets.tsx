"use client";

import { useChanges } from "@/context/ChangesContext";

type Props = {
  colors: string[];
  children?: React.ReactNode;
  index: number;
  activePreset: number | null;
  setActivePreset: (i: number) => void;
};

export default function ColorPresets({
  colors,
  children,
  index,
  activePreset,
  setActivePreset,
}: Props) {
  const { updateSiteConfig } = useChanges();
  const isActive = activePreset === index;

  const handleClick = () => {
    // Aktualizuj wszystkie kolory w contextcie
    updateSiteConfig({
      bg_color: colors[0],
      primary_color: colors[1],
      secondary_color: colors[2],
      text_color_primary: colors[3],
      text_color_secondary: colors[4],
    });

    setActivePreset(index);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        flex items-center gap-3 py-3 px-4 border rounded-md bg-background cursor-pointer
        transition
        ${isActive ? "outline-2 outline-primary" : "hover:outline"}
      `}
    >
      <div className="w-full flex flex-row justify-between items-center">
        <p className="my-2">{children}</p>
        <div className="flex flex-row gap-2">
          {colors.map((color, i) => (
            <div
              key={i}
              className="size-4"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

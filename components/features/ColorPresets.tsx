"use client";

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
  const isActive = activePreset === index;

  const handleClick = () => {
    const form = document.querySelector("form");
    if (!form) return;

    (form.querySelector('[name="bg_color"]') as HTMLInputElement).value =
      colors[0];
    (form.querySelector('[name="primary_color"]') as HTMLInputElement).value =
      colors[1];
    (form.querySelector('[name="secondary_color"]') as HTMLInputElement).value =
      colors[2];
    (
      form.querySelector('[name="text_color_primary"]') as HTMLInputElement
    ).value = colors[3];
    (
      form.querySelector('[name="text_color_secondary"]') as HTMLInputElement
    ).value = colors[4];

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

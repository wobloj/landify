import { MoonIcon, SunIcon } from "lucide-react";
import { Switch } from "../ui/switch";
import { useId, useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function DarkModeSwitch() {
  const { theme, setTheme } = useTheme();
  const id = useId();

  // Czekamy aż theme będzie gotowe (next-themes odczyta z localStorage)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Dopóki theme nie jest zainicjalizowane — nie renderuj
  if (!mounted) return null;

  const checked = theme === "dark";

  const toggle = () => {
    setTheme(checked ? "light" : "dark");
  };

  return (
    <div
      className="group inline-flex items-center gap-2 absolute top-8 left-4"
      data-state={checked ? "checked" : "unchecked"}
    >
      <span
        id={`${id}-light`}
        className="group-data-[state=checked]:text-muted-foreground/70 cursor-pointer text-left text-sm font-medium"
        aria-controls={id}
        onClick={() => setTheme("light")}
      >
        <SunIcon className="size-4" aria-hidden="true" />
      </span>

      <Switch
        id={id}
        checked={checked}
        onCheckedChange={toggle}
        aria-labelledby={`${id}-dark ${id}-light`}
        aria-label="Toggle between dark and light mode"
      />

      <span
        id={`${id}-dark`}
        className="group-data-[state=unchecked]:text-muted-foreground/70 cursor-pointer text-right text-sm font-medium"
        aria-controls={id}
        onClick={() => setTheme("dark")}
      >
        <MoonIcon className="size-4" aria-hidden="true" />
      </span>
    </div>
  );
}

"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { iconOptions } from "@/lib/consts/socialIcons";
import { useChanges } from "@/context/ChangesContext";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { FooterConfig } from "@/lib/types/types";

type Social = {
  icon: string;
  link: string;
  social_name: string;
};

interface FooterEditorProps {
  initialFooterConfig: FooterConfig;
}

export default function FooterEditor({
  initialFooterConfig,
}: FooterEditorProps) {
  const { updateFooter } = useChanges();

  const [localSocials, setLocalSocials] = useState<Social[]>(
    initialFooterConfig.socials_json?.socials || [],
  );

  const syncSocials = (newSocials: Social[]) => {
    setLocalSocials(newSocials);
    updateFooter({ socials_json: { socials: newSocials } });
  };

  const handleIconChange = (index: number, value: string) => {
    const next = [...localSocials];
    const label = iconOptions.find((o) => o.value === value)?.label ?? value;
    next[index] = { ...next[index], icon: value, social_name: label };
    syncSocials(next);
  };

  const handleLinkChange = (index: number, value: string) => {
    const next = [...localSocials];
    next[index] = { ...next[index], link: value };
    syncSocials(next);
  };

  const handleAdd = () => {
    // Wybierz pierwszą nieużywaną ikonę
    const usedIcons = localSocials.map((s) => s.icon);
    const firstFree = iconOptions.find((o) => !usedIcons.includes(o.value));
    const defaultIcon = firstFree ?? iconOptions[0];

    syncSocials([
      ...localSocials,
      { icon: defaultIcon.value, link: "", social_name: defaultIcon.label },
    ]);
  };

  const handleRemove = (index: number) => {
    syncSocials(localSocials.filter((_, i) => i !== index));
  };

  const maxReached = localSocials.length >= iconOptions.length;

  return (
    <div className="flex flex-col gap-3 text-sm">
      {/* COPYRIGHT */}
      <div className="space-y-2 p-3 border rounded-md bg-background">
        <Label>Tekst w stopce</Label>
        <Input
          className="mt-2"
          defaultValue={initialFooterConfig.copyright_text}
          onChange={(e) => updateFooter({ copyright_text: e.target.value })}
        />
      </div>

      {/* EMAIL */}
      <div className="space-y-2 p-3 border rounded-md bg-background">
        <Label>Email do kontaktu</Label>
        <Input
          className="mt-2"
          defaultValue={initialFooterConfig.email}
          onChange={(e) => updateFooter({ email: e.target.value })}
        />
      </div>

      {/* SOCIALS */}
      <div className="space-y-3 p-3 border rounded-md bg-background">
        <div className="flex items-center justify-between">
          <Label>Social Media</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            disabled={maxReached}
            className="h-7 w-7 p-0"
            title={maxReached ? "Dodano wszystkie dostępne serwisy" : "Dodaj"}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {localSocials.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-2">
            Brak social media. Kliknij + aby dodać.
          </p>
        )}

        <div className="flex flex-col gap-3">
          {localSocials.map((social, index) => (
            <div
              key={index}
              className="relative flex flex-col gap-2 p-4 border rounded-md bg-muted/30"
            >
              {/* Przycisk usuwania */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleRemove(index)}
                className="absolute -top-2 -right-2 h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                title="Usuń"
              >
                <Minus className="w-3 h-3" />
              </Button>

              <Select
                value={social.icon}
                onValueChange={(value) => handleIconChange(index, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Wybierz serwis" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      // Wyłącz opcje już użyte przez inne wpisy
                      disabled={localSocials.some(
                        (s, i) => s.icon === option.value && i !== index,
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Link do profilu (np. https://facebook.com/...)"
                value={social.link}
                onChange={(e) => handleLinkChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

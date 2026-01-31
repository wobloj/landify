import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Separator } from "@/components/ui/separator";
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

export default function FooterEditor({ initialFooterConfig }) {
  const { updateFooter } = useChanges();
  const socials = initialFooterConfig.socials_json?.socials || [];
  const [localSocials, setLocalSocials] = useState(socials);

  const updateSocials = (newSocials: typeof socials) => {
    setLocalSocials(newSocials);
    updateFooter({
      socials_json: { socials: newSocials },
    });
  };

  const handleIconChange = (index: number, value: string) => {
    const next = [...localSocials];
    next[index] = { ...next[index], icon: value };
    updateSocials(next);
  };

  const handleLinkChange = (index: number, value: string) => {
    const next = [...localSocials];
    next[index] = { ...next[index], link: value };
    updateSocials(next);
  };

  return (
    <div className="flex flex-col gap-3 text-sm">
      {/* COPYRIGHT */}
      <div className="space-y-4 p-3 border rounded-md bg-background">
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
      <div className="space-y-2 p-3 border rounded-md bg-background">
        <Label className="mb-4">Social Media</Label>

        <div className="flex flex-col gap-4 mt-2">
          {localSocials.map((social, index) => (
            <div key={index} className="flex flex-col gap-2">
              <Select
                value={social.icon}
                onValueChange={(value) => handleIconChange(index, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Wybierz social" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Link do profilu"
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

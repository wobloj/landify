"use client";

import { useChanges } from "@/context/ChangesContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiteConfig } from "@/lib/types/types";
import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";

interface SiteSelectorProps {
  sites: SiteConfig[];
  currentSiteId: number | null;
}

/**
 * Komponent do wybierania aktywnej strony użytkownika
 * Wyświetla listę wszystkich stron użytkownika (max 3)
 * Przełączanie odbywa się przez zmianę URL: /admin?site=slug
 */
export function SiteSelector({ sites, currentSiteId }: SiteSelectorProps) {
  const { hasChanges } = useChanges();
  const router = useRouter();

  const handleSiteChange = (value: string) => {
    if (hasChanges) {
      const confirmed = window.confirm(
        "Masz niezapisane zmiany. Czy na pewno chcesz zmienić stronę? Niezapisane zmiany zostaną utracone.",
      );
      if (!confirmed) return;
    }

    // Znajdź wybraną stronę
    const selectedSite = sites.find((s) => s.id.toString() === value);
    if (!selectedSite) return;

    // Przekieruj do /admin z nowym slug w query params
    router.push(`/admin?site=${selectedSite.site_slug}`);
  };

  if (!sites || sites.length <= 1) {
    // Jeśli użytkownik ma tylko jedną stronę, nie pokazuj selecta
    return null;
  }

  const currentSite = sites.find((s) => s.id === currentSiteId);

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select
        value={currentSiteId?.toString() || ""}
        onValueChange={handleSiteChange}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue>
            {currentSite ? (
              <div className="flex flex-col text-left">
                <span className="font-medium">{currentSite.app_title}</span>
                <span className="text-xs text-muted-foreground">
                  /{currentSite.site_slug}
                </span>
              </div>
            ) : (
              "Wybierz stronę"
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {sites.map((site) => (
            <SelectItem key={site.id} value={site.id.toString()}>
              <div className="flex flex-col">
                <span className="font-medium">{site.app_title}</span>
                <span className="text-xs text-muted-foreground">
                  /{site.site_slug}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

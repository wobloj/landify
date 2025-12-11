import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
// Zmieniono import "next/link" na standardowy tag <a>, aby uniknąć problemów z kompilacją
// import Link from "next/link";
import {
  getSectionsData,
  getSiteConfig,
  SiteConfig,
} from "@/lib/supabase/data"; // Spodziewana ścieżka do danych
import { LandingPagePreview } from "@/components/features/LandingPagePreview";

// Własny komponent wyświetlający stronę "Under Construction"
function UnderConstructionPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 text-center p-6">
      <Wrench size={64} className="text-gray-500 animate-pulse" />
      <h1 className="text-3xl font-bold">Strona w Budowie</h1>
      <p className="text-lg text-muted-foreground">
        Przepraszamy za utrudnienia. Nasz Landify jest tymczasowo niedostępny.
        Proszę spróbować ponownie później.
      </p>
      {/* Użycie standardowego <a> zamiast <Link> */}
      <a href="/auth">
        <Button className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 transition duration-150 shadow-lg">
          Przejdź do Panelu Admina
        </Button>
      </a>
    </div>
  );
}

export default async function Home() {
  const configSite = await getSiteConfig();
  const configSections = await getSectionsData();

  if (!configSite || !configSections) {
    // Awaryjny stan w przypadku błędu bazy danych
    return <UnderConstructionPage />;
  }

  // GŁÓWNA LOGIKA WARUNKOWA
  if (!configSite.is_published) {
    return <UnderConstructionPage />;
  }

  // Strona opublikowana
  return (
    <LandingPagePreview
      configSections={configSections}
      configSite={configSite}
    />
  );
}

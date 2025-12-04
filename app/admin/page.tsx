import { getSiteConfig } from "@/lib/supabase/data";
import { LandingPagePreview } from "@/components/features/LandingPagePreview";

/**
 * Strona główna panelu administracyjnego.
 * Jest to komponent serwerowy, który pobiera konfigurację strony
 * i przekazuje ją do komponentu podglądu.
 */
export default async function AdminPage() {
  const configSite = await getSiteConfig();

  if (!configSite) {
    return (
      <div className="text-center p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-xl font-bold text-red-500">Błąd</h1>
        <p className="text-gray-600 mt-2">
          Nie udało się załadować konfiguracji strony. Sprawdź, czy dane
          istnieją w bazie.
        </p>
      </div>
    );
  }

  // W Layout.tsx ten komponent jest renderowany w sekcji "podglądu"
  // z ustawionym justify-center.
  return (
    <div>
      {/* LandingPagePreview renderuje podgląd strony na podstawie danych
        edytowanych w bocznym pasku (AdminSidebar). 
      */}
      <LandingPagePreview configSite={configSite} />
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import {
  getFooterConfig,
  getSectionsData,
  getSiteConfig,
  getWipData,
} from "@/lib/supabase/data";
import FullSite from "@/components/features/FullSite";

function UnderConstructionPage({ wipData }: { wipData: any }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 text-center p-6">
      <Wrench size={64} className="text-gray-500 animate-pulse" />
      <h1 className="text-3xl font-bold">{wipData?.title}</h1>
      <p className="text-lg text-muted-foreground">
        Przepraszamy za utrudnienia. Nasz Landify jest tymczasowo niedostępny.
        Proszę spróbować ponownie później.
      </p>
      <a href="/auth">
        <Button className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 transition duration-150 shadow-lg">
          Przejdź do Panelu Admina
        </Button>
      </a>
    </div>
  );
}

export default async function page() {
  const configSite = await getSiteConfig();
  const configSections = await getSectionsData();
  const configFooter = await getFooterConfig();

  if (!configSite || !configSections) {
    return <UnderConstructionPage wipData={wipData} />;
  }

  if (!configSite.is_published) {
    return <UnderConstructionPage wipData={wipData} />;
  }

  return (
    <FullSite
      configSections={configSections}
      configSite={configSite}
      configFooter={configFooter}
    />
  );
}

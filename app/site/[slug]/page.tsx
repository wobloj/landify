import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound, redirect } from "next/navigation";
import FullSite from "@/components/features/FullSite";
import {
  getSiteConfig,
  getSectionsData,
  getFooterConfig,
  getWipData,
  getSiteIdBySlug,
} from "@/lib/supabase/data";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function UnderConstructionPage({ wipData }: { wipData: any }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 text-center p-6">
      <Wrench size={64} className="text-gray-500 animate-pulse" />
      <h1 className="text-3xl font-bold">
        {wipData?.title || "Strona w budowie"}
      </h1>
      <p className="text-lg text-muted-foreground">
        {wipData?.desc ||
          "Przepraszamy za utrudnienia. Strona jest tymczasowo niedostępna."}
      </p>
      <a href="/auth">
        <Button className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 transition duration-150 shadow-lg">
          Przejdź do Panelu Admina
        </Button>
      </a>
    </div>
  );
}

export default async function SitePreviewPage({ params }: PageProps) {
  const { slug } = await params;

  // Sprawdź czy użytkownik jest zalogowany
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  // Pobierz site_id na podstawie slug - automatycznie sprawdza czy należy do usera
  const siteId = await getSiteIdBySlug(slug);

  if (!siteId) {
    notFound(); // 404 jeśli strona nie istnieje lub nie należy do usera
  }

  // Pobierz dane równolegle
  const [configSite, configSections, configFooter, wipData] = await Promise.all(
    [
      getSiteConfig(siteId),
      getSectionsData(siteId),
      getFooterConfig(siteId),
      getWipData(siteId),
    ],
  );

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

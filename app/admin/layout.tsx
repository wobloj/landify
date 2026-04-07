import { ChangesProvider } from "@/context/ChangesContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { SectionSelectionProvider } from "@/context/SectionSelectionContext";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserSites } from "@/lib/supabase/data";

interface AdminLayoutProps {
  children: React.ReactNode;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminLayout({
  children,
  searchParams,
}: AdminLayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // ✅ Handle undefined searchParams
  let initialSiteId: number | undefined;

  if (searchParams) {
    const params = await searchParams;
    const siteIdParam = params.site as string | undefined;

    if (siteIdParam) {
      const siteId = parseInt(siteIdParam);

      // Sprawdź czy strona należy do użytkownika
      const userSites = await getUserSites();
      const siteExists = userSites.find((s) => s.id === siteId);

      if (siteExists) {
        initialSiteId = siteId;
      }
    }
  }

  return (
    <SidebarProvider>
      <ChangesProvider initialSiteId={initialSiteId}>
        <SectionSelectionProvider>{children}</SectionSelectionProvider>
      </ChangesProvider>
    </SidebarProvider>
  );
}

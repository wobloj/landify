import { ChangesProvider } from "@/context/ChangesContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { SectionSelectionProvider } from "@/context/SectionSelectionContext";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="h-screen w-full">
        <SectionSelectionProvider>
          <SidebarProvider>
            <ChangesProvider>{children}</ChangesProvider>
          </SidebarProvider>
        </SectionSelectionProvider>
      </div>
    </>
  );
}

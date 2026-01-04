import { SaveButton } from "@/components/features/SaveButton";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChangesProvider } from "@/context/ChangesContext";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="h-screen w-full">
        <SidebarProvider>
          <ChangesProvider>{children}</ChangesProvider>
        </SidebarProvider>
      </div>
    </>
  );
}

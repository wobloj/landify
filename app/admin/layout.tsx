import AdminSidebar from "@/components/features/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-row w-full">
      <SidebarProvider>{children}</SidebarProvider>
    </div>
  );
}

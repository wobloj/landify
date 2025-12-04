"use client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logout } from "@/app/auth/action";

export default function LogoutButton() {
  const router = useRouter();

  const signOut = async () => {
    await logout();
    router.push("/");
  };

  return (
    <Button className="mx-4 cursor-pointer flex-1" onClick={signOut}>
      <LogOut />
      Wyloguj
    </Button>
  );
}

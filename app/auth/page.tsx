import AuthForm from "@/components/forms/auth-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <div>
      <p className="text-4xl font-semibold mb-20">Witaj w Landify</p>
      <AuthForm />
    </div>
  );
}

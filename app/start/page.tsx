import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import FirstRegister from "@/components/features/FirstRegister";
import { checkIfUserCompletedSetup } from "./actions";

export default async function StartPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  // // Sprawdź czy użytkownik ukończył setup
  // const completedSetup = await checkIfUserCompletedSetup();

  // if (completedSetup) {
  //   // Użytkownik już przeszedł przez onboarding - przekieruj do dashboard
  //   redirect("/dashboard");
  // }

  // Nowy użytkownik - pokaż wybór planu
  return (
    <div className="h-screen w-screen">
      <FirstRegister />
    </div>
  );
}

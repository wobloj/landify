"use server";

import { createClient } from "@/lib/supabase/server";


export async function login(email: string, pass: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });

  if (error) {
    return { error: error.message, success: false };
  }

  // Sukces! Ciasteczka sesyjne zostały ustawione automatycznie przez createClient
  return { success: true, user: data.user };
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
}
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

  return { success: true, user: data.user };
}

export async function register(email: string, pass: string) {
  if (!email || !pass) {
    return { success: false, error: "Invalid input" };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    user: data.user,
    session: data.session,
  };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

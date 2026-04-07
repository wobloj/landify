"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// Używamy absolutnych ścieżek importu, aby uniknąć błędów
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// Importujemy Server Action z absolutnej ścieżki
import { login } from "@/app/auth/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const authFormSchema = z.object({
  email: z
    .string()
    .email("Nieprawidłowy format adresu email")
    .min(1, "Email jest wymagany"),
  password: z.string().min(1, "Hasło jest wymagane"),
});

type AuthFormValues = z.infer<typeof authFormSchema>;

export default function AuthForm() {
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: AuthFormValues) => {
    setGlobalError(null);
    const { email, password } = data;

    // Wywołanie Server Action
    const result = await login(email, password);

    if (result.error) {
      // Obsługa błędu zwróconego z Supabase
      setGlobalError("Nieprawidłowy email lub hasło");
      console.error(result.error);
      return;
    }

    // Sukces - odśwież router, aby middleware mógł zadziałać z nowym ciasteczkiem
    router.refresh();
    router.push("/dashboard");
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-5 w-full max-w-sm mx-auto"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {globalError && (
          <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
            {globalError}
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hasło</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mt-4 mx-auto w-3/5 cursor-pointer"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logowanie...
            </>
          ) : (
            "Zaloguj się"
          )}
        </Button>
      </form>
    </Form>
  );
}

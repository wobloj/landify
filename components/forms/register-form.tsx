import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { login, register } from "@/app/auth/actions";

const registerFormSchema = z
  .object({
    email: z
      .string()
      .email("Nieprawidłowy format adresu email")
      .min(1, "Email jest wymagany"),
    password: z.string().min(1, "Hasło jest wymagane"),
    repeatPassword: z.string().min(1, "Powtórzenie hasła jest wymagane"),
  })
  .superRefine(({ repeatPassword, password }, ctx) => {
    if (repeatPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Hasła muszą być identyczne",
        path: ["repeatPassword"],
      });
    }
  });

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setGlobalError(null);
    const { email, password } = data;

    // Wywołanie Server Action
    const result = await register(email, password);

    if (result.error) {
      setGlobalError("Nieprawidłowy email lub hasło");
      console.error(result.error);
      return;
    }

    router.refresh();
    await login(email, password);
    router.push("/admin");
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
              <FormLabel>
                <span className="text-red-400">*</span> Email
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="email@example.com"
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
              <FormLabel>
                <span className="text-red-400">*</span>Hasło
              </FormLabel>
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
        <FormField
          control={form.control}
          name="repeatPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <span className="text-red-400">*</span>Powtórz hasło
              </FormLabel>
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
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Rejestrowanie...
            </>
          ) : (
            "Zarejestruj się"
          )}
        </Button>
      </form>
    </Form>
  );
}

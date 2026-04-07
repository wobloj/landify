"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";
import Link from "next/link";
import DarkModeSwitch from "./DarkModeSwitch";
import { Button } from "../ui/button";
import { Settings, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { updateUserAccount } from "@/app/dashboard/actions";
import { useActionState, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type UserData = {
  username?: string | null;
  email?: string | null;
  plan?: string | null;
};

type DashboardSettingsProps = {
  userData: UserData;
};

// Inicjalny pusty stan formularza
const initialState = {
  success: false,
  message: "",
  usernameUpdated: false,
  emailUpdated: false,
};

export default function DashboardSettings({
  userData,
}: DashboardSettingsProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    updateUserAccount,
    initialState,
  );

  const [formValues, setFormValues] = useState({
    username: userData?.username || "",
    email: userData?.email || "",
  });

  useEffect(() => {
    if (open) {
      setFormValues({
        username: userData?.username || "",
        email: userData?.email || "",
      });
    }
  }, [userData]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <Settings />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader className="gap-1">
          <DialogTitle className="flex flex-row items-center gap-2">
            <Settings />
            Ustawienia
          </DialogTitle>
          <DialogDescription className="text-sm">
            Ustawienia preferencji. Pamiętaj o wciśnięciu przycisku zapisz.
          </DialogDescription>
        </DialogHeader>

        <FieldSeparator />

        {/* Form WEWNĄTRZ DialogContent - poprawna struktura */}
        <form action={formAction}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="mb-1">Dane konta</FieldLegend>
              <FieldDescription className="text-sm">
                Dane użytkownika, wraz z subskrybcjami konta.
              </FieldDescription>
              <FieldGroup className="gap-5">
                <Field className="gap-2">
                  <FieldLabel htmlFor="username">Nazwa użytkownika</FieldLabel>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Brak"
                    value={formValues.username}
                    onChange={handleInputChange}
                    disabled={isPending}
                  />
                </Field>

                <Field className="gap-2">
                  <FieldLabel htmlFor="subscription">Subskrybcja</FieldLabel>
                  <Link className="text-indigo-500" href={"/plan"}>
                    {userData?.plan === "premium"
                      ? "Premium"
                      : userData?.plan === "basic"
                        ? "Basic"
                        : "Free"}
                  </Link>
                  <FieldDescription>
                    Kliknij w plan by zmienić lub anulować subskrypcje.
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend className="mb-1">Preferencje konta</FieldLegend>
              <FieldDescription className="text-sm">
                Ustaw stronę pod własne preferencje.
              </FieldDescription>
            </FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>Dark mode</FieldLabel>
                <DarkModeSwitch />
              </Field>
            </FieldGroup>
          </FieldGroup>

          <FieldSeparator className="my-4" />

          {/* Feedback po akcji - sukces lub ogólny błąd */}
          {state.message && !state.message.toLowerCase().includes("e-mail") && (
            <div
              className={cn(
                "mb-4 flex items-start gap-2 rounded-md px-3 py-2 text-sm",
                state.success
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200",
              )}
            >
              {state.success ? (
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              )}
              <span>{state.message}</span>
            </div>
          )}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Zapisywanie...
                </>
              ) : (
                "Zapisz zmiany"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

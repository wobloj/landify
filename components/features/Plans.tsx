"use client";

import { Button } from "../ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { STRIPE_PLANS, PlanType } from "@/lib/stripe/config";

export default function Plans() {
  const [loading, setLoading] = useState<PlanType | null>(null);

  const handleSelectPlan = async (plan: PlanType) => {
    setLoading(plan);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Błąd tworzenia sesji płatności");
      }

      if (data.success || data.url) {
        // Free - natychmiastowe przekierowanie
        if (plan === "free") {
          window.location.href = "/dashboard";
          return;
        }

        // Paid plans - przekieruj do Stripe
        if (data.url) {
          window.location.href = data.url;
        }
      }
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Wystąpił błąd podczas wyboru planu");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-row gap-10 px-20">
      {/* FREE PLAN */}
      <Card className="flex flex-col max-w-96">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Free</CardTitle>
          <CardDescription>Plan bezpłatny</CardDescription>
        </CardHeader>
        <CardDescription className="text-center px-10 flex-1">
          Ten plan umożliwia tworzenie maksymalnie 1 landing page z podstawowymi
          funkcjami. Idealny dla osób rozpoczynających przygodę z Landify.
        </CardDescription>

        <div className="px-6 py-4">
          <div className="space-y-2">
            {STRIPE_PLANS.free.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <CardFooter className="flex flex-col gap-2">
          <div>
            <p className="text-3xl font-bold">$0</p>
            <p className="text-xs text-muted-foreground">na zawsze</p>
          </div>
          <Button
            className="w-full mt-4 cursor-pointer"
            onClick={() => handleSelectPlan("free")}
            disabled={loading !== null}
          >
            {loading === "free" ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Aktywowanie...
              </>
            ) : (
              "Wybierz plan"
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* BASIC PLAN */}
      <Card className="flex flex-col border-primary max-w-96">
        <CardHeader className="text-center relative">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
            Najpopularniejszy
          </div>
          <CardTitle className="text-3xl">Basic</CardTitle>
          <CardDescription>Plan podstawowy</CardDescription>
        </CardHeader>
        <CardDescription className="text-center px-10 flex-1">
          Ten plan umożliwia tworzenie maksymalnie 2 landing pages z
          rozszerzonymi funkcjami. Idealny dla małych projektów.
        </CardDescription>

        <div className="px-6 py-4">
          <div className="space-y-2">
            {STRIPE_PLANS.basic.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <CardFooter className="flex flex-col gap-2">
          <div>
            <p className="text-3xl font-bold">${STRIPE_PLANS.basic.price}</p>
            <p className="text-xs text-muted-foreground">miesięcznie</p>
          </div>
          <Button
            className="w-full mt-4 cursor-pointer"
            onClick={() => handleSelectPlan("basic")}
            disabled={loading !== null}
          >
            {loading === "basic" ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Przekierowywanie...
              </>
            ) : (
              "Wybierz plan"
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* PREMIUM PLAN */}
      <Card className="flex flex-col max-w-96">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Premium</CardTitle>
          <CardDescription>Plan zaawansowany</CardDescription>
        </CardHeader>
        <CardDescription className="text-center px-10 flex-1">
          Ten plan umożliwia tworzenie maksymalnie 3 landing pages z
          odblokowanymi wszystkimi funkcjami. Idealny dla profesjonalistów.
        </CardDescription>

        <div className="px-6 py-4">
          <div className="space-y-2">
            {STRIPE_PLANS.premium.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <CardFooter className="flex flex-col gap-2">
          <div>
            <p className="text-3xl font-bold">${STRIPE_PLANS.premium.price}</p>
            <p className="text-xs text-muted-foreground">miesięcznie</p>
          </div>
          <Button
            className="w-full mt-4 cursor-pointer"
            onClick={() => handleSelectPlan("premium")}
            disabled={loading !== null}
          >
            {loading === "premium" ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Przekierowywanie...
              </>
            ) : (
              "Wybierz plan"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

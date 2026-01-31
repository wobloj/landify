import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { STRIPE_PLANS, PlanType } from "@/lib/stripe/config";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Pobierz zalogowanego użytkownika
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Musisz być zalogowany" },
        { status: 401 },
      );
    }

    const { plan } = (await req.json()) as { plan: PlanType };

    // Walidacja planu
    if (!plan || !STRIPE_PLANS[plan]) {
      return NextResponse.json(
        { error: "Nieprawidłowy plan" },
        { status: 400 },
      );
    }

    // Free plan - nie wymaga płatności
    if (plan === "free") {
      // Zaktualizuj plan bezpośrednio w bazie
      const { error } = await supabase
        .from("site_config")
        .update({
          plan: "free",
          plan_expired_date: null, // Free nie wygasa
        })
        .eq("user_id", user.id)
        .eq("is_active", true);

      if (error) {
        return NextResponse.json(
          { error: "Błąd aktualizacji planu" },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "Plan Free został aktywowany",
      });
    }

    const planConfig = STRIPE_PLANS[plan];

    // Utwórz Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: planConfig.priceId!,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&plan=${plan}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        plan: plan,
      },
      customer_email: user.email,
      subscription_data: {
        metadata: {
          userId: user.id,
          plan: plan,
        },
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Błąd tworzenia sesji płatności" },
      { status: 500 },
    );
  }
}

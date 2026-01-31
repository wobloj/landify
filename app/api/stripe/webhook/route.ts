import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// Użyj service role key dla webhook (bez RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Dodaj do .env.local
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const plan = session.metadata?.plan;

  if (!userId || !plan) {
    console.error("Missing metadata in checkout session");
    return;
  }

  // Oblicz datę wygaśnięcia (30 dni od teraz)
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30);

  // Zaktualizuj wszystkie aktywne strony użytkownika
  const { error } = await supabaseAdmin
    .from("site_config")
    .update({
      plan: plan,
      plan_expired_date: expirationDate.toISOString(),
    })
    .eq("user_id", userId)
    .eq("is_active", true);

  if (error) {
    console.error("Error updating user plan:", error);
    throw error;
  }

  console.log(`✅ Plan ${plan} activated for user ${userId}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  const plan = subscription.metadata?.plan;

  if (!userId || !plan) return;

  // Zaktualizuj datę wygaśnięcia na podstawie końca okresu rozliczeniowego
  const expirationDate = new Date(subscription.current_period_end * 1000);

  await supabaseAdmin
    .from("site_config")
    .update({
      plan: plan,
      plan_expired_date: expirationDate.toISOString(),
    })
    .eq("user_id", userId)
    .eq("is_active", true);

  console.log(`✅ Subscription updated for user ${userId}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) return;

  // Przywróć plan free po anulowaniu subskrypcji
  await supabaseAdmin
    .from("site_config")
    .update({
      plan: "free",
      plan_expired_date: null,
    })
    .eq("user_id", userId)
    .eq("is_active", true);

  console.log(`✅ Subscription cancelled, user ${userId} downgraded to free`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription as string,
  );

  const userId = subscription.metadata?.userId;
  if (!userId) return;

  // Przedłuż datę wygaśnięcia
  const expirationDate = new Date(subscription.current_period_end * 1000);

  await supabaseAdmin
    .from("site_config")
    .update({
      plan_expired_date: expirationDate.toISOString(),
    })
    .eq("user_id", userId)
    .eq("is_active", true);

  console.log(`✅ Payment succeeded for user ${userId}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription as string,
  );

  const userId = subscription.metadata?.userId;
  if (!userId) return;

  // Opcjonalnie: Wyślij email z ostrzeżeniem
  console.warn(`⚠️ Payment failed for user ${userId}`);
}

export const STRIPE_PLANS = {
  free: {
    name: "Free",
    price: 0,
    priceId: null, // Free nie ma Price ID
    maxSites: 1,
    features: [
      "1 landing page",
      "Podstawowe sekcje",
      "Galeria zdjęć",
      "Formularz kontaktowy",
    ],
  },
  basic: {
    name: "Basic",
    price: 2.99,
    priceId: "price_1Sux6PRn9Pcz24eAbauZir5w", // ← ZAMIEŃ NA SWÓJ PRICE ID
    maxSites: 2,
    features: [
      "2 landing pages",
      "Wszystkie sekcje",
      "Galeria zdjęć",
      "Formularz kontaktowy",
      "Własna domena",
    ],
  },
  premium: {
    name: "Premium",
    price: 4.99,
    priceId: "price_1Sux6fRn9Pcz24eAwrhxEf8y", // ← ZAMIEŃ NA SWÓJ PRICE ID
    maxSites: 3,
    features: [
      "3 landing pages",
      "Wszystkie sekcje",
      "Nieograniczona galeria",
      "Zaawansowane formularze",
      "Własna domena",
      "Analityka",
      "Priorytetowe wsparcie",
    ],
  },
} as const;

export type PlanType = keyof typeof STRIPE_PLANS;

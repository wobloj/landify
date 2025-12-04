import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // 1. Tworzymy pustą odpowiedź, którą będziemy modyfikować
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // To jest kluczowe: ustawiamy ciastka i w Request i w Response
          // dzięki temu sesja jest odświeżana i dostępna od razu
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 2. Pobieramy użytkownika. To bezpieczniejsze niż getSession
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. Sprawdzamy, czy użytkownik próbuje wejść do panelu admina
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // A. Brak użytkownika -> Redirect na login
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // B. Logika 24h (Hard Logout)
    // Pobieramy czas ostatniego zalogowania z obiektu user
    const lastSignIn = new Date(user.last_sign_in_at || 0).getTime();
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (now - lastSignIn > twentyFourHours) {
      // Jeśli minęły 24h, wyloguj i przekieruj
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/login?error=session_expired", request.url));
    }
  }

  return response;
}

export const config = {
  // Matcher ignoruje pliki statyczne, obrazy itp.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
# Landify

Landify to aplikacja CMS oparta na Next.js, która umożliwia tworzenie, edycję i publikację stron typu landing page przez panel administracyjny.

## Opis projektu

Aplikacja pozwala użytkownikom zarządzać stronami za pomocą narzędzi dostępnych na stronie. Celem jest szybkie i wygodne tworzenie stron CMS z edycją treści, obrazów i podglądem w czasie rzeczywistym.

## Najważniejsze funkcjonalności

- panel administracyjny do edycji stron
- obsługa wielu stron użytkownika
- wizualny podgląd strony w panelu admina
- edycja sekcji takich jak Hero, About, How It Works i FAQ
- upload obrazów przez drag & drop
- zapis zmian do bazy danych (Supabase)
- wskaźnik nies zapisanych zmian oraz automatyczne odliczanie
- przejrzysta nawigacja po sekcjach strony publicznej
- generowanie publicznej strony pod `/site/[slug]`

## Technologie

Projekt używa następujących technologii i bibliotek:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase (auth, storage, baza danych)
- Radix UI
- DND Kit
- Stripe
- Lexical

## Struktura projektu

- `app/` — routing aplikacji, strony publiczne i panel admina
- `components/` — komponenty UI, edytory, podgląd strony i narzędzia
- `components/features/` — moduły funkcjonalne, np. `DotNavigation`, `DragAndDropFiles`, `LandingPagePreview`
- `components/features/editors/` — edytory sekcji strony, np. `HeroEditor`, `ImageEditor`
- `lib/` — konfiguracja Supabase, helpery, typy i logika serwerowa
- `context/` — zarządzanie stanem zmian podczas edycji

## Uruchamianie lokalne

1. Zainstaluj zależności:

```bash
npm install
```

2. Skonfiguruj zmienne środowiskowe. Przykładowe wartości:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```

3. Uruchom aplikację lokalnie:

```bash
npm run dev
```

4. Otwórz stronę w przeglądarce:

```text
http://localhost:3000
```

## Skrypty

- `npm run dev` — uruchamia serwer deweloperski
- `npm run build` — buduje aplikację do produkcji
- `npm run start` — uruchamia zbudowaną aplikację
- `npm run lint` — sprawdza kod przy użyciu ESLint

## Jak korzystać

1. Zaloguj się i przejdź do panelu admina.
2. Wybierz istniejącą stronę lub utwórz nową.
3. Edytuj dostępne sekcje i przesyłaj obrazy.
4. Zachowaj zmiany i sprawdź podgląd strony.
5. Otwórz publiczną wersję strony przez `/site/[slug]`.


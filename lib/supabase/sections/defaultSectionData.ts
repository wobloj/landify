export function getDefaultSectionData(sectionType: string) {
  switch (sectionType) {
    case "hero":
      return {
        title: "Nowa sekcja Hero",
        data_json: {
          subtitle: "Twoje hasło marketingowe",
          button_text: "Zacznij teraz",
        },
      };

    case "features":
      return {
        title: "Dlaczego warto?",
        data_json: {
          items: [
            {
              title: "Funkcja 1",
              desc: "Krótki opis funkcji",
              icon: "sun",
            },
            {
              title: "Funkcja 2",
              desc: "Krótki opis funkcji",
              icon: "smile",
            },
            {
              title: "Funkcja 3",
              desc: "Krótki opis funkcji",
              icon: "pen",
            },
          ],
        },
      };

    case "cta":
      return {
        title: "Dołącz teraz",
        data_json: {
          desc: "Zostaw swój email, aby zacząć",
          button_text: "Wyślij",
        },
      };

    default:
      return {
        title: "Nowa sekcja",
        data_json: {},
      };
  }
}

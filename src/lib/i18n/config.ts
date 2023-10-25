export const DEFAULT_LANG = "fr" as const;
export const LANGS = ["en", "fr"] as const;

/**
 * Make sure the english route correspond to the file system.
 * Make sure the order of the routes correspond between each lang route array
 */
export const routeFr = ["/"];
export const routeEn = ["/"];

export const dictionaries = {
  en: async () => ({
    en: (await import("@/dictionaries/en/en.json")).default,
    test: (await import("@/dictionaries/en/test.json")).default,
  }),
  fr: async () => ({
    fr: (await import("@/dictionaries/fr/fr.json")).default,
    test: (await import("@/dictionaries/fr/test.json")).default,
  }),
};

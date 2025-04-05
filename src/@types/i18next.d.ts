import langPl from "../utils/i18n/locales/pl";

type TranslationKeys<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? `${K & string}.${TranslationKeys<T[K]>}`
        : K & string;
    }[keyof T]
  : never;

type ModalTranslationKeys<T, E extends string> = Extract<
  TranslationKeys<T>,
  `${E}.${string}`
>;

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      translation: typeof langPl;
    };
    defaultNS: "translation";
  }

  type CustomKeys = TranslationKeys<typeof langPl>;
}

import { Translation } from "../types";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      translation: Translation;
    };
  }
}

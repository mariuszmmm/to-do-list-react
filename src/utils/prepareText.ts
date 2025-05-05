import { t } from "i18next";

export const prepareText = (text: string): string => {
  let preparedText = text.trim();

  preparedText = preparedText.replace(/\s{2,}/g, " ");

  if (preparedText.includes(` ${t("prepareText.period")}`)) {
    preparedText = preparedText.replaceAll(` ${t("prepareText.period")}`, ".");
  }

  if (preparedText.includes(` ${t("prepareText.comma")}`)) {
    preparedText = preparedText.replaceAll(` ${t("prepareText.comma")}`, ",");
  }

  if (preparedText.charAt(0) !== preparedText.charAt(0).toUpperCase()) {
    preparedText = preparedText.charAt(0).toUpperCase() + preparedText.slice(1);
  }

  if (preparedText.includes(".")) {
    for (let i = 0; i < preparedText.length; i++) {
      if (
        (preparedText[i] === "." || preparedText[i] === ",") &&
        preparedText[i + 1] !== " " &&
        preparedText[i + 1] !== "." &&
        preparedText[i + 1] !== ","
      ) {
        preparedText =
          preparedText.slice(0, i + 1) + " " + preparedText.slice(i + 1);
      }
    }

    const bigLetterIndexes = [];

    for (let i = 0; i < preparedText.length; i++) {
      if (
        preparedText[i] === "." &&
        preparedText[i + 1] === " " &&
        preparedText[i - 1] !== "."
      ) {
        bigLetterIndexes.push(i + 2);
      }
    }

    for (let i = 0; i < bigLetterIndexes.length; i++) {
      const index = bigLetterIndexes[i];
      if (preparedText[index]) {
        preparedText =
          preparedText.slice(0, index) +
          preparedText[index].toUpperCase() +
          preparedText.slice(index + 1);
      }
    }
  }

  return preparedText;
};

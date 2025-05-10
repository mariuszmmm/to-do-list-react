import { t } from "i18next";

export const prepareText = (text: string): string => {
  let preparedText = text;
  preparedText = trimText(preparedText);
  preparedText = removeDoubleSpaces(preparedText);
  preparedText = replaceWordPeriod(preparedText);
  preparedText = replaceWordComma(preparedText);
  preparedText = capitalizeFirstLetter(preparedText);
  preparedText = capitalizeAfterPeriod(preparedText);
  preparedText = addSpaceAfterPunctuation(preparedText);

  return preparedText;
};

const trimText = (text: string) => text.trim();
const removeDoubleSpaces = (text: string) => text.replace(/\s{2,}/g, " ");

const replaceWordPeriod = (text: string) => {
  if (!text.includes(` ${t("prepareText.period")}`)) return text;
  return text.replaceAll(` ${t("prepareText.period")}`, ".");
};

const replaceWordComma = (text: string) => {
  if (!text.includes(` ${t("prepareText.comma")}`)) return text;
  return text.replaceAll(` ${t("prepareText.comma")}`, ",");
};

const capitalizeFirstLetter = (text: string) => {
  if (text.charAt(0) === text.charAt(0).toUpperCase()) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const capitalizeAfterPeriod = (text: string) => {
  if (!text.includes(".")) return text;
  let result = text;
  const bigLetterIndexes: number[] = [];

  for (let i = 0; i < result.length; i++) {
    if (result[i] === "." && result[i + 1] === " " && result[i - 1] !== ".") {
      bigLetterIndexes.push(i + 2);
    }
  }

  for (const index of bigLetterIndexes) {
    if (result[index]) {
      result =
        result.slice(0, index) +
        result[index].toUpperCase() +
        result.slice(index + 1);
    }
  }

  return result;
};

const addSpaceAfterPunctuation = (text: string) => {
  if (!text.includes(".")) return text;
  let result = text;
  for (let i = 0; i < result.length; i++) {
    if (
      (result[i] === "." || result[i] === ",") &&
      result[i + 1] !== " " &&
      result[i + 1] !== "." &&
      result[i + 1] !== "," &&
      result[i - 1] !== "-" &&
      isNaN(+result[i - 1])
    ) {
      result = result.slice(0, i + 1) + " " + result.slice(i + 1);
    }
  }

  return result;
};

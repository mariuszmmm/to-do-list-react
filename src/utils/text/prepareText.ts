import { t } from "i18next";

export const prepareText = (text: string): string => {
  let preparedText = text;
  preparedText = trimText(preparedText);
  preparedText = replaceWordPeriod(preparedText);
  preparedText = replaceWordComma(preparedText);
  preparedText = replaceWordEnter(preparedText);
  preparedText = removeSpaceAfterNewline(preparedText);
  preparedText = capitalizeFirstLetter(preparedText);
  preparedText = capitalizeAfterPeriod(preparedText);
  preparedText = removeDoublePunctuation(preparedText);
  return preparedText;
};

const trimText = (text: string) => text.replace(/^[ \t]+|[ \t]+$/g, "");

const replaceWordPeriod = (text: string) => {
  if (!text.includes(` ${t("prepareText.period")}`)) return text;
  return text.replaceAll(` ${t("prepareText.period")}`, ". ");
};

const replaceWordComma = (text: string) => {
  if (!text.includes(` ${t("prepareText.comma")}`)) return text;
  return text.replaceAll(` ${t("prepareText.comma")}`, ", ");
};

const replaceWordEnter = (text: string) => {
  if (!text.includes(` ${t("prepareText.enter")}`)) return text;
  return text.replaceAll(` ${t("prepareText.enter")}`, "\n");
};

const removeSpaceAfterNewline = (text: string) => text.replace(/\n +/g, "\n");

const capitalizeFirstLetter = (text: string) => {
  if (text.charAt(0) === text.charAt(0).toUpperCase()) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const capitalizeAfterPeriod = (text: string) => {
  let result = text;
  const bigLetterIndexes: number[] = [];

  for (let i = 0; i < result.length; i++) {
    if (result[i] === "." && result[i + 1] === " " && result[i - 1] !== ".") {
      bigLetterIndexes.push(i + 2);
    }
    if (result[i] === "\n") {
      let j = i + 1;
      while (result[j] === " ") j++;
      if (result[j] && result[j] === result[j].toLowerCase() && /[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(result[j])) {
        bigLetterIndexes.push(j);
      }
    }
  }

  for (const index of bigLetterIndexes) {
    if (result[index]) {
      result = result.slice(0, index) + result[index].toUpperCase() + result.slice(index + 1);
    }
  }

  return result;
};

const removeDoublePunctuation = (text: string) => {
  return text
    .replace(/\.{2,}/g, ".")
    .replace(/,{2,}/g, ",")
    .replace(/\?{2,}/g, "?")
    .replace(/!{2,}/g, "!")
    .replace(/ {2,}/g, " ");
};

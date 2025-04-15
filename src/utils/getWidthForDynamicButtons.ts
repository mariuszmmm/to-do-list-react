export const getWidthForFormTasksButton = (lang: string) => {
  if (lang === "pl") return "136px";
  if (lang === "en") return "130px";
  if (lang === "de") return "206px";
  return "auto";
};

export const getWidthForFetchExampleTasksButton = (lang: string) => {
  if (lang === "pl") return "234px";
  if (lang === "en") return "164px";
  if (lang === "de") return "208px";
  return "auto";
};

export const getWidthForToggleShowSearchButton = (lang: string) => {
  if (lang === "pl") return "80px";
  if (lang === "en") return "85px";
  if (lang === "de") return "142px";
  return "auto";
};

export const getWidthForToggleHideDoneButton = (lang: string) => {
  if (lang === "pl") return "142px";
  if (lang === "en") return "92px";
  if (lang === "de") return "230px";
  return "auto";
};

export const getWidthForSwitchTaskSortButton = (lang: string) => {
  if (lang === "pl") return "150px";
  if (lang === "en") return "122px";
  if (lang === "de") return "190px";
  return "auto";
};

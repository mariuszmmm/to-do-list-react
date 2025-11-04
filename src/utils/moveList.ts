import { List } from "../types";

export const moveListUp = (index: number, listsToSort: List[]) => {
  if (index === 0) return listsToSort;
  if (index < 0 || index >= listsToSort.length) return listsToSort;
  const prevList = listsToSort[index - 1];
  const selectedList = listsToSort[index];

  if (!selectedList || !prevList) return listsToSort;
  const newList = listsToSort.map((list, i) => {
    if (i === index - 1) {
      return selectedList;
    }
    if (i === index) {
      return prevList;
    }
    return list;
  });

  return newList;
};

export const moveListDown = (index: number, listsToSort: List[]) => {
  if (index < 0 || index >= listsToSort.length - 1) return listsToSort;
  const selectedList = listsToSort[index];
  const nextList = listsToSort[index + 1];

  if (!selectedList || !nextList) return listsToSort;
  const newList = listsToSort.map((list, i) => {
    if (i === index) {
      return nextList;
    }
    if (i === index + 1) {
      return selectedList;
    }
    return list;
  });

  return newList;
};

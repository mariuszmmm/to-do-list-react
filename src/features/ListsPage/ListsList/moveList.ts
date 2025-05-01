import { List, Version } from "../../../types";

export const moveListUp = (
  index: number,
  listsToSort: { lists: List[]; version: Version }
) => {
  if (index === 0) return null;
  if (index < 0 || index >= listsToSort.lists.length) return null;
  const prevList = listsToSort.lists[index - 1];
  const selectedList = listsToSort.lists[index];

  if (!selectedList || !prevList) return null;
  const newList = listsToSort.lists.map((list, i) => {
    if (i === index - 1) {
      return selectedList;
    }
    if (i === index) {
      return prevList;
    }
    return list;
  });

  return { ...listsToSort, lists: newList };
};

export const moveListDown = (
  index: number,
  listsToSort: { lists: List[]; version: Version }
) => {
  if (index < 0 || index >= listsToSort.lists.length - 1) return null;
  const selectedList = listsToSort.lists[index];
  const nextList = listsToSort.lists[index + 1];

  if (!selectedList || !nextList) return null;
  const newList = listsToSort.lists.map((list, i) => {
    if (i === index) {
      return nextList;
    }
    if (i === index + 1) {
      return selectedList;
    }
    return list;
  });

  return { ...listsToSort, lists: newList };
};

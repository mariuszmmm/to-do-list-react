import { List, Version } from "../../../types";

export const moveListUp = (
  index: number,
  listToSort: { lists: List[]; version: Version },
  setList: React.Dispatch<
    React.SetStateAction<{ lists: List[]; version: Version } | null>
  >
) => {
  if (index === 0) return;
  if (index < 0 || index >= listToSort.lists.length) return;
  const prevList = listToSort.lists[index - 1];
  const selectedList = listToSort.lists[index];

  if (!selectedList || !prevList) return;
  const newList = listToSort.lists.map((list, i) => {
    if (i === index - 1) {
      return selectedList;
    }
    if (i === index) {
      return prevList;
    }
    return list;
  });

  setList({ ...listToSort, lists: newList });
};

export const moveListDown = (
  index: number,
  listToSort: { lists: List[]; version: Version },
  setList: React.Dispatch<
    React.SetStateAction<{ lists: List[]; version: Version } | null>
  >
) => {
  if (index < 0 || index >= listToSort.lists.length - 1) return;
  const selectedList = listToSort.lists[index];
  const nextList = listToSort.lists[index + 1];

  if (!selectedList || !nextList) return;
  const newList = listToSort.lists.map((list, i) => {
    if (i === index) {
      return nextList;
    }
    if (i === index + 1) {
      return selectedList;
    }
    return list;
  });

  setList({ ...listToSort, lists: newList });
};

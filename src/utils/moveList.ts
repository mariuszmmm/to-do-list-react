export const moveListUp = (index: number, listToSort: any[]) => {
  if (index === 0) return listToSort;
  if (index < 0 || index >= listToSort.length) return listToSort;
  const prevList = listToSort[index - 1];
  const selectedList = listToSort[index];

  if (!selectedList || !prevList) return listToSort;
  const newList = listToSort.map((list, i) => {
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

export const moveListDown = (index: number, listToSort: any[]) => {
  if (index < 0 || index >= listToSort.length - 1) return listToSort;
  const selectedList = listToSort[index];
  const nextList = listToSort[index + 1];

  if (!selectedList || !nextList) return listToSort;
  const newList = listToSort.map((list, i) => {
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

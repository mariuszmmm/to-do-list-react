import { useListSyncManager } from "../hooks";
import { ListsData } from "../types";

interface ListSyncManagerProps {
  listsData: ListsData | undefined;
  saveListMutation: any;
}

export const ListSyncManager = ({
  listsData,
  saveListMutation,
}: ListSyncManagerProps) => {
  useListSyncManager({ listsData, saveListMutation });

  return null;
};

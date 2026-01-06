import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from ".";
import { List, ListsData } from "../types";
import { getUserToken } from "../utils/getUserToken";
import { addDataApi } from "../api/fetchDataApi";
import { openModal } from "../Modal/modalSlice";

/**
 * Hook for saving a list using a mutation with react-query.
 * Handles API call, modal feedback on error, and cache update on success.
 */
export const useSaveListMutation = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      list,
      deviceId,
    }: {
      list: List;
      deviceId: string;
    }) => {
      const token = await getUserToken();
      if (!token) {
        console.error("No token found");
        throw new Error("User token is null");
      }
      console.log("Saving list with ID:", list.id);

      // Call API to add or update the list for the user
      return addDataApi(token, list, deviceId);
    },
    // retry: 3, // Ile razy retry
    // retryDelay: 5000, // Delay między retry
    networkMode: "online", // Czeka na internet lub 'online'
    // On success, update cache and log in development mode
    onSuccess: async (response: { data: ListsData }) => {
      queryClient.setQueryData(["listsData"], response.data);
    },
    // On error, show error modal
    onError: () => {
      dispatch(
        openModal({
          title: { key: "modal.listSave.title" },
          message: { key: "modal.listSave.message.error.default" },
          type: "error",
        })
      );
    },
  });
};

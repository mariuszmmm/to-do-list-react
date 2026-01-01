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

      // Call API to add or update the list for the user
      return addDataApi(token, list, deviceId);
    },
    // Log mutation start in development mode
    onMutate: ({ list }) => {
      process.env.NODE_ENV === "development" &&
        process.env.NODE_ENV === "development" &&
        console.log("Saving list mutation started for list:", list);
    },
    // On success, update cache and log in development mode
    onSuccess: async (response: { data: ListsData }) => {
      queryClient.setQueryData(["listsData"], response.data);
      process.env.NODE_ENV === "development" &&
        process.env.NODE_ENV === "development" &&
        console.log("Saving list mutation completed for list:", response.data);
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

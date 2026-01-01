import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDataApi } from "../api/fetchDataApi";
import { useAppDispatch } from "./redux";
import { openModal } from "../Modal/modalSlice";
import { List } from "../types";
import { getUserToken } from "../utils/getUserToken";

/**
 * Hook for updating/sorting lists using a mutation with react-query.
 * Handles API call, modal feedback, and cache update on success or error.
 */
export const useUpdateListsMutation = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listsToSort,
      deviceId,
    }: {
      listsToSort: List[];
      deviceId: string;
    }) => {
      const token = await getUserToken();
      if (!token) {
        console.error("No token found");
        throw new Error("User token is null");
      }
      // Call API to update/sort the lists for the user
      return updateDataApi(token, listsToSort, deviceId);
    },
    // Show loading modal when mutation starts
    onMutate: () => {
      dispatch(
        openModal({
          title: { key: "modal.listsUpdate.title" },
          message: { key: "modal.listsUpdate.message.loading" },
          type: "loading",
        })
      );
    },
    // On success, update cache and show success or conflict modal
    onSuccess: async (response) => {
      queryClient.setQueryData(["listsData"], response.data);
      if (response.data.conflict) {
        dispatch(
          openModal({
            title: { key: "modal.listsUpdate.title" },
            message: { key: "modal.listsUpdate.message.error.conflict" },
            type: "error",
          })
        );
      } else {
        dispatch(
          openModal({
            title: { key: "modal.listsUpdate.title" },
            message: { key: "modal.listsUpdate.message.success" },
            type: "success",
          })
        );
      }
    },
    // On error, show error modal
    onError: () => {
      dispatch(
        openModal({
          title: { key: "modal.listsUpdate.title" },
          message: { key: "modal.listsUpdate.message.error.default" },
          type: "error",
        })
      );
    },
  });
};

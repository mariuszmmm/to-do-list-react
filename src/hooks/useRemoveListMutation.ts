import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeDataApi } from "../api/fetchDataApi";
import { useAppDispatch } from ".";
import { openModal } from "../Modal/modalSlice";
import { Version } from "../types";
import { getUserToken } from "../utils/getUserToken";

/**
 * Hook for removing a list using a mutation with react-query.
 * Handles API call, modal feedback, and cache update on success or error.
 */
export const useRemoveListMutation = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      version,
      listId,
      deviceId,
    }: {
      version: Version;
      listId: string;
      deviceId: string;
    }) => {
      const token = await getUserToken();
      if (!token) {
        console.error("No token found");
        throw new Error("User token is null");
      }

      return removeDataApi(token, version, listId, deviceId);
    },
    // Show loading modal when mutation starts
    onMutate: () => {
      dispatch(
        openModal({
          title: { key: "modal.listRemove.title" },
          message: { key: "modal.listRemove.message.loading" },
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
            title: { key: "modal.listRemove.title" },
            message: { key: "modal.listRemove.message.error.conflict" },
            type: "error",
          })
        );
      } else {
        dispatch(
          openModal({
            title: { key: "modal.listRemove.title" },
            message: {
              key: "modal.listRemove.message.success",
            },
            type: "success",
          })
        );
      }
    },
    // On error, show error modal
    onError: () => {
      dispatch(
        openModal({
          title: { key: "modal.listRemove.title" },
          message: { key: "modal.listRemove.message.error.default" },
          type: "error",
        })
      );
    },
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeDataApi } from "../api/fetchDataApi";
import { useAppDispatch } from ".";
import { openModal } from "../Modal/modalSlice";
import { List, Version } from "../types";
import { getUserToken } from "../utils/getUserToken";

export const useRemoveListMutation = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      version,
      listId,
    }: {
      version: Version;
      listId: List["id"];
    }) => {
      const token = await getUserToken();
      if (!token) {
        console.error("No token found");
        throw new Error("User token is null");
      }

      return removeDataApi(token, version, listId);
    },
    onMutate: () => {
      dispatch(
        openModal({
          message: { key: "modal.listRemove.message.loading" },
          type: "loading",
        })
      );
    },
    onSuccess: async (response) => {
      // await queryClient.invalidateQueries({ queryKey: ["lists"] });
      queryClient.setQueryData(["lists"], response.data);
      if (response.data.conflict) {
        dispatch(
          openModal({
            message: { key: "modal.listRemove.message.error.conflict" },
            type: "error",
          })
        );
      } else {
        dispatch(
          openModal({
            message: {
              key: "modal.listRemove.message.success",
            },
            type: "success",
          })
        );
      }
    },
    onError: () => {
      dispatch(
        openModal({
          message: { key: "modal.listRemove.message.error.default" },
          type: "error",
        })
      );
    },
  });
};

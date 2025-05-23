import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDataApi } from "../../../api/fetchDataApi";
import { useAppDispatch } from "../../../hooks";
import { openModal } from "../../../Modal/modalSlice";
import { List, Version } from "../../../types";
import { getUserToken } from "../../../utils/getUserToken";

export const useUpdateListsMutation = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listsToSort,
    }: {
      listsToSort: { version: Version; lists: List[] };
    }) => {
      const token = await getUserToken();
      if (!token) {
        console.error("No token found");
        throw new Error("User token is null");
      }

      return updateDataApi(token, listsToSort.version, listsToSort.lists);
    },
    onMutate: () => {
      dispatch(
        openModal({
          title: { key: "modal.listsUpdate.title" },
          message: { key: "modal.listsUpdate.message.loading" },
          type: "loading",
        })
      );
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["lists"] });
      if (response.data.conflict) {
        dispatch(
          openModal({
            message: { key: "modal.listsUpdate.message.error.conflict" },
            type: "error",
          })
        );
      } else {
        dispatch(
          openModal({
            message: {
              key: "modal.listsUpdate.message.success",
            },
            type: "success",
          })
        );
      }
    },
    onError: () => {
      dispatch(
        openModal({
          message: { key: "modal.listsUpdate.message.error.default" },
          type: "error",
        })
      );
    },
  });
};

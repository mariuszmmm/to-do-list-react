import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "../../../../hooks";
import { List, Version } from "../../../../types";
import { getUserToken } from "../../../../utils/getUserToken";
import { addDataApi } from "../../../../api/fetchDataApi";
import { openModal } from "../../../../Modal/modalSlice";

export const useAddListMutation = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ version, list }: { version: Version; list: List }) => {
      const token = await getUserToken();
      if (!token) {
        console.error("No token found");
        throw new Error("User token is null");
      }

      return addDataApi(token, version, list);
    },
    onMutate: ({ list }) => {
      dispatch(
        openModal({
          title: { key: "modal.listSave.title" },
          message: {
            key: "modal.listSave.message.loading",
            values: { listName: list.name },
          },
          type: "loading",
        })
      );
    },
    onSuccess: async (response, { list }) => {
      await queryClient.invalidateQueries({ queryKey: ["lists"] });
      if (response.data.conflict) {
        dispatch(
          openModal({
            message: { key: "modal.listSave.message.error.conflict" },
            type: "error",
          })
        );
      } else {
        dispatch(
          openModal({
            message: {
              key: "modal.listSave.message.success",
              values: { listName: list.name },
            },
            type: "success",
          })
        );
      }
    },
    onError: () => {
      dispatch(
        openModal({
          message: { key: "modal.listSave.message.error.default" },
          type: "error",
        })
      );
    },
  });
};

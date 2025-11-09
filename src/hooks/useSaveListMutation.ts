import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from ".";
import { List, Version } from "../types";
import { getUserToken } from "../utils/getUserToken";
import { addDataApi } from "../api/fetchDataApi";
import { openModal } from "../Modal/modalSlice";

export const useSaveListMutation = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ version, list }: { version: Version; list: List }) => {
      console.log(
        "useSaveListMutation - mutationFn called with version:",
        version,
        "and list:",
        list
      );
      const token = await getUserToken();
      if (!token) {
        console.error("No token found");
        throw new Error("User token is null");
      }

      return addDataApi(token, version, list);
    },

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["lists"] });
      if (response.data.conflict) {
        dispatch(
          openModal({
            title: { key: "modal.listSave.title" },
            message: { key: "modal.listSave.message.error.conflict" },
            type: "error",
          })
        );
      }
    },
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

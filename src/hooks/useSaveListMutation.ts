import {
  useMutation,
  //  useQueryClient
} from "@tanstack/react-query";
import { useAppDispatch } from ".";
import { List } from "../types";
import { getUserToken } from "../utils/getUserToken";
import { addDataApi } from "../api/fetchDataApi";
import { openModal } from "../Modal/modalSlice";

export const useSaveListMutation = () => {
  const dispatch = useAppDispatch();
  // const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ list }: { list: List }) => {
      const token = await getUserToken();
      if (!token) {
        console.error("No token found");
        throw new Error("User token is null");
      }

      return addDataApi(token, list);
    },
    // onMutate: ({ list }) => {
    //   dispatch(
    //     openModal({
    //       title: { key: "modal.listSave.title" },
    //       message: {
    //         key: "modal.listSave.message.loading",
    //         values: { name: list.name },
    //       },
    //       type: "loading",
    //     })
    //   );
    // },
    onSuccess: async (response) => {
      console.log("List saved successfully:", response.data);
      // Cache będzie zaktualizowany przez Ably, nie robimy tego tutaj
      // queryClient.setQueryData(["lists"], response.data);

      if (response.conflict) {
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

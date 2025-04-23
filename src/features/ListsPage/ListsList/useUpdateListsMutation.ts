import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDataApi } from "../../../api/fetchDataApi";
import { useAppDispatch } from "../../../hooks";
import { openModal } from "../../../Modal/modalSlice";
import { List, Version } from "../../../types";
import { getUserToken } from "../../../utils/getUserToken";

export const useUpdateListsMutation = ({
  confirmed,
  setListToSort,
}: {
  confirmed?: boolean;
  setListToSort: React.Dispatch<
    React.SetStateAction<{ lists: List[]; version: Version } | null>
  >;
}) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listToSort,
      force,
    }: {
      listToSort: { lists: List[]; version: Version };
      force?: boolean;
    }) => {
      const token = await getUserToken();
      if (!token) {
        console.error("No token found");
        throw new Error("User token is null");
      }

      return updateDataApi(token, listToSort.version, listToSort.lists, force);
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
      if (response.data.conflict && confirmed === undefined) {
        dispatch(
          openModal({
            message: { key: "modal.listsUpdate.message.confirm" },
            confirmButton: { key: "modal.buttons.replaceButton" },
            type: "confirm",
          })
        );
      } else {
        await queryClient.invalidateQueries({ queryKey: ["lists"] });
        setListToSort(null);
        dispatch(
          openModal(
            confirmed === false
              ? {
                  message: { key: "modal.listsUpdate.message.info" },
                  type: "info",
                }
              : {
                  message: {
                    key: "modal.listsUpdate.message.success",
                  },
                  type: "success",
                }
          )
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

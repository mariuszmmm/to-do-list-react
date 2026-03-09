import { useMutation } from "@tanstack/react-query";
import { auth } from "../../../../api/auth";
import { useAppDispatch } from "../../../../hooks";
import { openModal } from "../../../../Modal/modalSlice";
import { setAccountMode, setLoggedUser } from "../../accountSlice";
import { getUserToken } from "../../../../utils/auth/getUserToken";
import { deleteUserApi } from "../../../../api/fetchUserApi";
import { removeAccount } from "../../../../utils/auth/multiAccount";
import { syncToIndexedDB } from "../../../../utils/storage/storageSync";

export const useAccountDelete = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async () => {
      const user = auth.currentUser();
      const userToken = await getUserToken();

      if (!userToken || !user) {
        dispatch(setLoggedUser(null));
        throw new Error("User is logged out");
      }

      const response = await deleteUserApi(userToken);
      if (response.statusCode !== 204) throw new Error();

      const email = user.email;
      try {
        await user.logout();
      } catch (e) {}
      localStorage.removeItem("gotrue.user");
      await syncToIndexedDB("gotrue.user", null);
      if (email) removeAccount(email);

      return response;
    },

    onMutate: () => {
      dispatch(
        openModal({
          title: { key: "modal.accountDelete.title" },
          message: { key: "modal.accountDelete.message.loading" },
          type: "loading",
        }),
      );
    },

    onSuccess: async () => {
      dispatch(setLoggedUser(null));
      dispatch(setAccountMode("login"));
      dispatch(
        openModal({
          title: { key: "modal.accountDelete.title" },
          message: { key: "modal.accountDelete.message.success" },
          type: "loading",
        }),
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
      dispatch(setAccountMode("dataRemoval"));
      dispatch(
        openModal({
          title: { key: "modal.dataRemoval.title" },
          message: { key: "modal.dataRemoval.message.confirm" },
          confirmButton: { key: "modal.buttons.deleteButton" },
          type: "confirm",
        }),
      );
    },

    onError: async () => {
      dispatch(setAccountMode("logged"));
      dispatch(
        openModal({
          title: { key: "modal.accountDelete.title" },
          message: { key: "modal.accountDelete.message.error.default" },
          type: "error",
        }),
      );
    },
  });
};

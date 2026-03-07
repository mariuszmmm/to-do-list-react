import { useMutation } from "@tanstack/react-query";
import { auth } from "../../../../api/auth";
import { useAppDispatch } from "../../../../hooks";
import { openModal } from "../../../../Modal/modalSlice";
import { setLoggedUser } from "../../accountSlice";
import { removeAccount } from "../../../../utils/auth/multiAccount";
import { syncToIndexedDB } from "../../../../utils/storage/storageSync";

export const useLogout = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async () => {
      const user = auth.currentUser();
      if (!user) throw new Error("No user found");
      const email = user.email;
      const logoutResult = await user.logout();
      await syncToIndexedDB("gotrue.user", null);

      if (email) removeAccount(email);

      return logoutResult;
    },
    onMutate: () => {
      dispatch(
        openModal({
          title: { key: "modal.logout.title" },
          message: { key: "modal.logout.message.loading" },
          type: "loading",
        }),
      );
    },
    onSuccess: () => {
      dispatch(setLoggedUser(null));
      dispatch(
        openModal({
          title: { key: "modal.logout.title" },
          message: { key: "modal.logout.message.success" },
          type: "success",
        }),
      );
    },
    onError: () => {
      dispatch(
        openModal({
          title: { key: "modal.logout.title" },
          message: { key: "modal.logout.message.error.default" },
          type: "error",
        }),
      );
    },
  });
};

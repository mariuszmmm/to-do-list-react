import { useMutation } from "@tanstack/react-query";
import { auth } from "../../../api/auth";
import { useAppDispatch } from "../../../hooks";
import { openModal } from "../../../Modal/modalSlice";
import { setLoggedUserEmail } from "../accountSlice";

export const useLogout = () => {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: () => {
      const user = auth.currentUser();
      if (!user) throw new Error("No user found");

      return user.logout();
    },
    onMutate: () => {
      dispatch(
        openModal({
          message: { key: "modal.logout.message.loading" },
          type: "loading",
        }),
      );
    },
    onSuccess: () => {
      dispatch(setLoggedUserEmail(null));
      dispatch(
        openModal({
          message: { key: "modal.logout.message.success" },
          type: "success",
        }),
      );
    },
    onError: async () => {
      dispatch(
        openModal({
          message: { key: "modal.logout.message.error.default" },
          type: "error",
        }),
      );
    },
  });
};

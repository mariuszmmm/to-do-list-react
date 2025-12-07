import { useMutation } from "@tanstack/react-query";
import { auth } from "../../../api/auth";
import { useAppDispatch } from "../../../hooks";
import { openModal } from "../../../Modal/modalSlice";
import { setAccountMode, setLoggedUserEmail } from "../accountSlice";
import { getUserToken } from "../../../utils/getUserToken";

export const usePasswordChange = () => {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: ({ password }: { password: string }) => {
      const user = auth.currentUser();
      const userToken = getUserToken();

      if (!userToken || !user) {
        dispatch(setLoggedUserEmail(null));
        throw new Error("User is logged out");
      }

      return user.update({ password });
    },
    onMutate: () => {
      dispatch(
        openModal({
          title: { key: "modal.passwordChange.title" },
          message: { key: "modal.passwordChange.message.loading" },
          type: "loading",
        })
      );
    },
    onSuccess: () => {
      dispatch(
        openModal({
          title: { key: "modal.passwordChange.title" },
          message: { key: "modal.passwordChange.message.success" },
          type: "success",
        })
      );

      dispatch(setAccountMode("logged"));
    },
    onError: () => {
      dispatch(
        openModal({
          title: { key: "modal.passwordChange.title" },
          message: { key: "modal.passwordChange.message.error.default" },
          type: "error",
        })
      );
    },
  });
};

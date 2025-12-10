import { useMutation } from "@tanstack/react-query";
import { auth } from "../../../api/auth";
import { useAppDispatch } from "../../../hooks";
import { openModal } from "../../../Modal/modalSlice";
import { setLoggedUser } from "../accountSlice";

export const useLogout = () => {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: async () => {
      const user = auth.currentUser();
      if (!user) throw new Error("No user found");

      return await user.logout();
    },
    onMutate: () => {
      dispatch(
        openModal({
          title: { key: "modal.logout.title" },
          message: { key: "modal.logout.message.loading" },
          type: "loading",
        })
      );
    },
    onSuccess: () => {
      process.env.NODE_ENV === "development" &&
        process.env.NODE_ENV === "development" &&
        console.log("Logout successful");
      dispatch(setLoggedUser(null));
      dispatch(
        openModal({
          title: { key: "modal.logout.title" },
          message: { key: "modal.logout.message.success" },
          type: "success",
        })
      );
    },
    onError: async () => {
      dispatch(
        openModal({
          title: { key: "modal.logout.title" },
          message: { key: "modal.logout.message.error.default" },
          type: "error",
        })
      );
    },
  });
};

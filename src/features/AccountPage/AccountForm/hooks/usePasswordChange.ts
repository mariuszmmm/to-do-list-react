import { useMutation } from "@tanstack/react-query";
import { auth } from "../../../../api/auth";
import { useAppDispatch } from "../../../../hooks";
import { openModal } from "../../../../Modal/modalSlice";
import { setAccountMode, setLoggedUser } from "../../accountSlice";
import { getUserToken } from "../../../../utils/getUserToken";

/**
 * Hook for changing user password using a mutation with react-query.
 * Handles API call, modal feedback, and state updates on success or error.
 */
export const usePasswordChange = () => {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      const user = auth.currentUser();
      const userToken = await getUserToken();

      if (!userToken || !user) {
        dispatch(setLoggedUser(null));
        throw new Error("User is logged out");
      }

      // Call API to update the user password
      return user.update({ password });
    },
    // Show loading modal when mutation starts
    onMutate: () => {
      dispatch(
        openModal({
          title: { key: "modal.passwordChange.title" },
          message: { key: "modal.passwordChange.message.loading" },
          type: "loading",
        })
      );
    },
    // On success, show success modal and set account mode to logged
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
    // On error, show error modal
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

import { useMutation } from "@tanstack/react-query";
import { auth } from "../../../../api/auth";
import { useAppDispatch } from "../../../../hooks";
import { openModal } from "../../../../Modal/modalSlice";
import { setIsWaitingForConfirmation } from "../../accountSlice";
import i18n from "../../../../utils/i18n";
import { translateText } from "../../../../utils/translateText";

/**
 * Hook for registering a new user account using a mutation with react-query.
 * Handles API call, modal feedback, and state updates on success or error.
 */
export const useAccountRegister = () => {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      auth.signup(email, password),
    onMutate: () => {
      dispatch(
        openModal({
          title: { key: "modal.accountRegister.title" },
          message: { key: "modal.accountRegister.message.loading" },
          type: "loading",
        })
      );
    },
    onSuccess: (_, variables) => {
      dispatch(setIsWaitingForConfirmation(true));

      sessionStorage.setItem(
        "waitingForConfirmation",
        JSON.stringify({
          email: variables.email,
          password: variables.password,
          timestamp: Date.now(),
        })
      );

      dispatch(
        openModal({
          title: { key: "modal.accountRegister.title" },
          message: { key: "modal.accountRegister.message.info" },
          type: "info",
        })
      );
    },
    onError: async (error: any) => {
      const msg = error.json.msg;
      const translatedText = await translateText(msg, i18n.language);

      dispatch(
        openModal({
          title: { key: "modal.accountRegister.title" },
          message: translatedText || {
            key: "modal.accountRegister.message.error.default",
          },
          type: "error",
        })
      );
    },
  });
};

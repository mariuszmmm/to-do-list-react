import { useMutation } from "@tanstack/react-query";
import { auth } from "../../../../api/auth";
import { useAppDispatch } from "../../../../hooks";
import { openModal } from "../../../../Modal/modalSlice";
import { setAccountMode } from "../../accountSlice";
import i18n from "../../../../utils/i18n";
import { translateText } from "../../../../utils/translateText";

/**
 * Hook for requesting account password recovery using a mutation with react-query.
 * Handles API call, modal feedback, and state updates on success or error.
 */
export const useAccountRecovery = () => {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: ({ email }: { email: string }) =>
      auth.requestPasswordRecovery(email),
    // Show loading modal when mutation starts
    onMutate: () => {
      dispatch(
        openModal({
          title: { key: "modal.accountRecovery.title" },
          message: { key: "modal.accountRecovery.message.loading" },
          type: "loading",
        })
      );
    },
    // On success, show info modal and switch to login mode
    onSuccess: () => {
      dispatch(
        openModal({
          title: { key: "modal.accountRecovery.title" },
          message: { key: "modal.accountRecovery.message.info" },
          type: "info",
        })
      );

      dispatch(setAccountMode("login"));
    },
    // On error, translate error message and show error modal
    onError: async (error: any) => {
      const msg = error.json.msg;
      const translatedText = await translateText(msg, i18n.language);

      dispatch(
        openModal({
          title: { key: "modal.accountRecovery.title" },
          message: translatedText || {
            key: "modal.accountRecovery.message.error.default",
          },
          type: "error",
        })
      );
    },
  });
};

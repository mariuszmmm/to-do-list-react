import { useMutation } from "@tanstack/react-query";
import { auth } from "../../../api/auth";
import { useAppDispatch } from "../../../hooks";
import { openModal } from "../../../Modal/modalSlice";
import { setAccountMode } from "../accountSlice";
import i18n from "../../../utils/i18n";
import { translateText } from "../../../utils/translateText";

export const useAccountRecovery = () => {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: ({ email }: { email: string }) =>
      auth.requestPasswordRecovery(email),
    onMutate: () => {
      dispatch(
        openModal({
          title: { key: "modal.accountRecovery.title" },
          message: { key: "modal.accountRecovery.message.loading" },
          type: "loading",
        }),
      );
    },
    onSuccess: () => {
      dispatch(
        openModal({
          message: { key: "modal.accountRecovery.message.info" },
          type: "info",
        }),
      );

      dispatch(setAccountMode("login"));
    },
    onError: async (error: any) => {
      const msg = error.json.msg;
      const translatedText = await translateText(msg, i18n.language);

      dispatch(
        openModal({
          message: translatedText || {
            key: "modal.accountRecovery.message.error.default",
          },
          type: "error",
        }),
      );
    },
  });
};

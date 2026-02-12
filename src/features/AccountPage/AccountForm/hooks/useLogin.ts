import { useMutation } from "@tanstack/react-query";
import { auth } from "../../../../api/auth";
import { useAppDispatch } from "../../../../hooks";
import { openModal } from "../../../../Modal/modalSlice";
import { setAccountMode, setLoggedUser } from "../../accountSlice";
import { translateText } from "../../../../api/translateTextApi";
import i18n from "../../../../utils/i18n";

export const useLogin = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      auth.login(email, password, true),

    onMutate: () => {
      dispatch(
        openModal({
          title: { key: "modal.login.title" },
          message: { key: "modal.login.message.loading" },
          type: "loading",
        }),
      );
    },

    onSuccess: (response) => {
      dispatch(
        openModal({
          title: { key: "modal.login.title" },
          message: {
            key: "modal.login.message.success",
            values: { user: response.email },
          },
          type: "success",
        }),
      );

      dispatch(setAccountMode("logged"));

      if (response.email) {
        dispatch(
          setLoggedUser({
            email: response.email,
            name: response.user_metadata.full_name,
            roles: response.app_metadata.roles,
          }),
        );
      }
    },

    onError: async (error: any) => {
      const msg = error.json?.error_description || error.json;
      const translatedText = msg
        ? await translateText(msg, i18n.language)
        : null;

      dispatch(
        openModal({
          title: { key: "modal.login.title" },
          message: translatedText || {
            key: "modal.login.message.error.default",
          },
          type: "error",
        }),
      );
    },
  });
};

import { useMutation } from "@tanstack/react-query";
import { auth } from "../../../api/auth";
import { useAppDispatch } from "../../../hooks";
import { openModal } from "../../../Modal/modalSlice";
import { setAccountMode, setLoggedUserEmail } from "../accountSlice";
import { translateText } from "../../../utils/translateText";
import i18n from "../../../utils/i18n";

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
        })
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
        })
      );

      dispatch(setAccountMode("logged"));
      dispatch(setLoggedUserEmail(response.email));
    },
    onError: async (error: any) => {
      const error_description = error.json.error_description;
      const translatedText = await translateText(
        error_description,
        i18n.language
      );

      dispatch(
        openModal({
          title: { key: "modal.login.title" },
          message: translatedText || {
            key: "modal.login.message.error.default",
          },
          type: "error",
        })
      );
    },
  });
};

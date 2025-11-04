import { useEffect } from "react";
import { useAppDispatch } from "./redux";
import { clearLocalStorage } from "../utils/localStorage";
import {
  setLoggedUserEmail,
  setAccountMode,
} from "../features/AccountPage/accountSlice";
import { openModal } from "../Modal/modalSlice";

interface DataFetchingErrorParams {
  loggedUserEmail: string | null;
  isError: boolean;
}

export const useDataFetchingError = ({
  loggedUserEmail,
  isError,
}: DataFetchingErrorParams) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!loggedUserEmail) return;
    if (isError) {
      clearLocalStorage();
      dispatch(setLoggedUserEmail(null));
      dispatch(setAccountMode("login"));
      dispatch(
        openModal({
          title: { key: "modal.listsDownload.title" },
          message: { key: "modal.listsDownload.message.error.default" },
          type: "error",
        }),
      );
    }
  }, [loggedUserEmail, isError, dispatch]);
};

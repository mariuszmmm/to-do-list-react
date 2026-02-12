import { useEffect, useRef } from "react";
import { useTime } from "../../context/TimeContext";
import { useAppDispatch, useAppSelector } from "../redux/redux";
import { selectLoggedUserEmail, setLoggedUser, setAccountMode } from "../../features/AccountPage/accountSlice";
import { openModal } from "../../Modal/modalSlice";
import { auth } from "../../api/auth";
import { getTokenExpiresIn } from "../../utils/auth/tokenUtils";
import { getAutoRefreshSettingFromLocalStorage } from "../../utils/storage/localStorage";

export const useTokenValidation = () => {
  const dispatch = useAppDispatch();
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const hasReceivedValidTokenRef = useRef(false);
  const isRefreshingRef = useRef(false);
  const { now } = useTime();

  useEffect(() => {
    if (!loggedUserEmail) {
      hasReceivedValidTokenRef.current = false;
      return;
    }

    const user = auth.currentUser();
    if (!user) {
      return;
    }

    const tokenRemainingMs = getTokenExpiresIn(user, now);

    if (tokenRemainingMs > 0) {
      hasReceivedValidTokenRef.current = true;
    }

    if (hasReceivedValidTokenRef.current && tokenRemainingMs <= 0) {
      const autoRefreshEnabled = getAutoRefreshSettingFromLocalStorage();

      if (autoRefreshEnabled) {
        if (!isRefreshingRef.current) {
          isRefreshingRef.current = true;
          user
            .jwt()
            .catch((error) => {
              console.error("[useTokenValidation] Error during automatic token refresh:", error);
            })
            .finally(() => {
              isRefreshingRef.current = false;
            });
        }
      } else {
        if (!isRefreshingRef.current) {
          isRefreshingRef.current = true;
          user
            .logout()
            .catch((error) => {
              console.error("[useTokenValidation] Error during logout:", error);
            })
            .finally(() => {
              dispatch(setLoggedUser(null));
              dispatch(setAccountMode("login"));
              dispatch(
                openModal({
                  title: { key: "modal.logout.title" },
                  message: { key: "modal.logout.message.success" },
                  type: "info",
                }),
              );
              isRefreshingRef.current = false;
            });
        }
      }
    }
  }, [loggedUserEmail, dispatch, now]);
};

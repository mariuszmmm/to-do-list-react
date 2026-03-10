import { useEffect, useRef } from "react";
import { useTime } from "../../context/TimeContext";
import { useAppDispatch, useAppSelector } from "../redux/redux";
import {
  selectLoggedUserEmail,
  setLoggedUser,
  setAccountMode,
} from "../../features/AccountPage/accountSlice";
import { openModal } from "../../Modal/modalSlice";
import { auth } from "../../api/auth";
import { getTokenExpiresIn } from "../../utils/auth/tokenUtils";
import { getAutoRefreshSettingFromLocalStorage } from "../../utils/storage/localStorage";
import { syncToIndexedDB } from "../../utils/storage/storageSync";

export const useTokenValidation = () => {
  const dispatch = useAppDispatch();
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const hasAttemptedInitialRefreshRef = useRef(false);
  const isRefreshingRef = useRef(false);
  const { now } = useTime();

  useEffect(() => {
    if (!loggedUserEmail) {
      hasAttemptedInitialRefreshRef.current = false;
      return;
    }

    const user = auth.currentUser();
    if (!user) {
      return;
    }

    const tokenRemainingMs = getTokenExpiresIn(user, now);
    const autoRefreshEnabled = getAutoRefreshSettingFromLocalStorage();

    // Jeśli token wygasł (lub zaraz wygaśnie) i jeszcze nie próbowaliśmy go odświeżyć przy starcie,
    // to wymuszamy odświeżenie (jwt() automatycznie odświeży token jeśli trzeba).
    if (
      tokenRemainingMs <= 0 &&
      !hasAttemptedInitialRefreshRef.current &&
      autoRefreshEnabled
    ) {
      hasAttemptedInitialRefreshRef.current = true;
      if (!isRefreshingRef.current) {
        isRefreshingRef.current = true;
        user
          .jwt()
          .catch((error) => {
            console.error(
              "[useTokenValidation] Initial refresh attempt failed:",
              error,
            );
          })
          .finally(() => {
            isRefreshingRef.current = false;
          });
      }
      return;
    }

    // Jeśli token jest ważny, uznajemy, że start jest zaliczony i system może działać normalnie.
    if (tokenRemainingMs > 0) {
      hasAttemptedInitialRefreshRef.current = true;
    }

    if (hasAttemptedInitialRefreshRef.current && tokenRemainingMs <= 0) {
      if (autoRefreshEnabled) {
        if (!isRefreshingRef.current) {
          isRefreshingRef.current = true;
          user
            .jwt()
            .catch((error) => {
              console.error(
                "[useTokenValidation] Error during automatic token refresh:",
                error,
              );
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
            .then(() => syncToIndexedDB("gotrue.user", null))
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

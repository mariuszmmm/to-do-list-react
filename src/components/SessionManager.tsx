import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux/redux";
import { auth } from "../api/auth";
import {
  setAccountMode,
  setLoggedUser,
} from "../features/AccountPage/accountSlice";
import { saveCurrentAccount } from "../utils/auth/multiAccount";
import { openModal } from "../Modal/modalSlice";

export type SessionManagerProps = {
  authRoutes: string[];
};

export const SessionManager = ({ authRoutes }: SessionManagerProps) => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const user = auth.currentUser();
  const authRoute = authRoutes.includes(pathname);

  useEffect(() => {
    if (!authRoute) {
      if (user && user.email && !!user.token) {
        const isSwitching = !!sessionStorage.getItem("account_switch_target");
        if (!isSwitching) {
          saveCurrentAccount();
        }

        dispatch(setAccountMode("logged"));
        dispatch(
          setLoggedUser({
            email: user.email,
            name: user?.user_metadata?.full_name,
            roles: user?.app_metadata?.roles,
          }),
        );
      } else {
        dispatch(setAccountMode("login"));
        dispatch(setLoggedUser(null));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authRoute, user?.email, user?.token?.access_token, dispatch]);

  useEffect(() => {
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === "gotrue.user") {
        window.location.reload();
      }
    };

    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, []);

  useEffect(() => {
    const switchedTo = sessionStorage.getItem("account_switch_target");
    if (switchedTo) {
      sessionStorage.removeItem("account_switch_target");
      dispatch(
        openModal({
          title: { key: "modal.accountSwitch.title" },
          message: {
            key: "modal.accountSwitch.message.success",
            values: { email: switchedTo },
          },
          type: "success",
        }),
      );
    }

    const expiredEmail = sessionStorage.getItem("session_expired_email");
    if (expiredEmail) {
      sessionStorage.removeItem("session_expired_email");
      dispatch(
        openModal({
          title: { key: "modal.accountSwitch.title" },
          message: {
            key: "modal.accountSwitch.message.error.sessionExpired",
            values: { email: expiredEmail },
          },
          type: "error",
        }),
      );
    }
  }, [dispatch]);

  return null;
};

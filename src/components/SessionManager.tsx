import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux/redux";
import { auth } from "../api/auth";
import { setAccountMode, setLoggedUser } from "../features/AccountPage/accountSlice";

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
  }, [authRoute, user, dispatch]);

  useEffect(() => {
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === "gotrue.user") {
        window.location.reload();
      }
    };

    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

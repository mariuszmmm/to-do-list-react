import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  getSavedAccounts,
  switchAccount,
  removeAccount,
  SavedAccount,
} from "../../../utils/auth/multiAccount";
import { useAppSelector, useAppDispatch } from "../../../hooks/redux/redux";
import { selectLoggedUserEmail } from "../accountSlice";
import {
  openModal,
  closeModal,
  selectModalConfirmed,
} from "../../../Modal/modalSlice";

import {
  AccountContainer,
  AccountCard,
  AccountInfo,
  AccountAvatar,
  AccountEmail,
  ActionButtons,
  SwitcherButton,
  getAvatarColor,
} from "./styled";

export const AccountSwitcher = () => {
  const { t } = useTranslation("translation", { keyPrefix: "accountPage" });
  const dispatch = useAppDispatch();
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);
  const confirmed = useAppSelector(selectModalConfirmed);

  const [accounts, setAccounts] = useState<SavedAccount[]>([]);
  const [accountToRemove, setAccountToRemove] = useState<string | null>(null);

  useEffect(() => {
    setAccounts(getSavedAccounts());
  }, [loggedUserEmail]);

  useEffect(() => {
    if (accountToRemove) {
      if (confirmed === true) {
        removeAccount(accountToRemove);
        setAccounts(getSavedAccounts());
        dispatch(closeModal());
        setAccountToRemove(null);
      } else if (confirmed === false) {
        setAccountToRemove(null);
      }
    }
  }, [confirmed, accountToRemove, dispatch]);

  const handleSwitch = (email: string) => {
    dispatch(
      openModal({
        title: { key: "modal.accountSwitch.title" },
        message: { key: "modal.accountSwitch.message.loading" },
        type: "loading",
      }),
    );

    setTimeout(async () => {
      try {
        sessionStorage.setItem("account_switch_target", email);
        await switchAccount(email);
      } catch (err: any) {
        sessionStorage.removeItem("account_switch_target");

        const isSessionMissing = err?.message === "SESSION_MISSING";
        const messageKey = isSessionMissing
          ? "modal.accountSwitch.message.error.sessionExpired"
          : "modal.accountSwitch.message.error.default";

        dispatch(
          openModal({
            title: { key: "modal.accountSwitch.title" },
            message: { key: messageKey },
            type: "error",
          }),
        );
      }
    }, 700);
  };

  const handleRemove = (email: string) => {
    setAccountToRemove(email);
    dispatch(
      openModal({
        title: { key: "modal.accountDelete.title" },
        message: t("switcher.confirmForget") as string,
        type: "confirm",
      }),
    );
  };

  if (accounts.length === 0) {
    return null;
  }

  const otherAccounts = accounts.filter((acc) => acc.email !== loggedUserEmail);

  if (otherAccounts.length === 0) {
    return null;
  }

  return (
    <AccountContainer>
      {otherAccounts.map((acc) => {
        const initial = (acc.name || acc.email)[0].toUpperCase();
        const bgColor = getAvatarColor(acc.email);
        return (
          <AccountCard key={acc.email}>
            <AccountInfo>
              <AccountAvatar aria-hidden="true" $bgColor={bgColor}>
                {initial}
              </AccountAvatar>
              <AccountEmail>{acc.email}</AccountEmail>
            </AccountInfo>

            <ActionButtons>
              <SwitcherButton onClick={() => handleSwitch(acc.email)}>
                {t("switcher.switch")}
              </SwitcherButton>
              <SwitcherButton $danger onClick={() => handleRemove(acc.email)}>
                {t("switcher.forget")}
              </SwitcherButton>
            </ActionButtons>
          </AccountCard>
        );
      })}
    </AccountContainer>
  );
};

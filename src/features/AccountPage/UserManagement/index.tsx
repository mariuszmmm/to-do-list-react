import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../hooks/redux/redux";
import {
  selectPresenceUsers,
  selectIsAdmin,
  selectLoggedUserEmail,
} from "../accountSlice";
import {
  UserManagementContainer,
  InviteSection,
  InviteInputWrapper,
  FormLabel,
  Message,
  SubTitle,
  MessageWrapper,
  UsersListItem,
  UserInfo,
  UserEmail,
  UserStatusBadge,
  DeleteButton,
} from "./styled";
import { Input } from "../../../common/Input";
import { FormButton } from "../../../common/FormButton";
import {
  StyledList,
  StyledListContent,
  StyledListItem,
  StyledSpan,
} from "../../../common/StyledList";
import {
  inviteUserApi,
  getUsersListApi,
  adminDeleteUserApi,
  UserListItem,
} from "../../../api/backupApi";
import { getUserToken } from "../../../utils/auth/getUserToken";
import { translateText } from "../../../api/translateTextApi";

export const UserManagement = () => {
  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "accountPage",
  });
  const presenceUsers = useAppSelector(selectPresenceUsers);
  const isAdmin = useAppSelector(selectIsAdmin);
  const loggedUserEmail = useAppSelector(selectLoggedUserEmail);

  const [email, setEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [confirmDeleteEmail, setConfirmDeleteEmail] = useState<string | null>(
    null,
  );
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const token = await getUserToken();
      if (!token) return;
      const response = await getUsersListApi(token);
      if (response.success && response.data?.users) {
        setUsers(response.data.users);
      }
    } catch {
      // silent fail
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    if (loggedUserEmail && isAdmin) {
      fetchUsers();
    }
  }, [fetchUsers, isAdmin, loggedUserEmail]);

  const handleInvite = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsInviting(true);
    setMessage(null);

    try {
      const token = await getUserToken();
      if (token) {
        const response = await inviteUserApi(token, email);
        console.log(response);
        if (response.success) {
          setMessage({
            text: t("userManagement.invite.success"),
            isError: false,
          });
          setEmail("");
          fetchUsers();
        } else {
          let errorMessage = response.message;
          if (errorMessage) {
            try {
              const translated = await translateText(
                errorMessage,
                i18n.language,
              );
              if (translated) {
                errorMessage = translated;
              }
            } catch (err) {
              console.error("Translation fail", err);
            }
          }

          if (!errorMessage) {
            errorMessage = t("userManagement.invite.error");
          }

          setMessage({
            text: errorMessage,
            isError: true,
          });
        }
      }
    } catch (error) {
      setMessage({ text: t("userManagement.invite.error"), isError: true });
    } finally {
      setIsInviting(false);
    }
  };

  const handleDelete = async (targetEmail: string) => {
    if (confirmDeleteEmail !== targetEmail) {
      setConfirmDeleteEmail(targetEmail);
      return;
    }

    setDeletingEmail(targetEmail);
    setConfirmDeleteEmail(null);
    try {
      const token = await getUserToken();
      if (!token) return;
      const response = await adminDeleteUserApi(token, targetEmail);
      if (response.success) {
        setUsers((prev) => prev.filter((u) => u.email !== targetEmail));
      }
    } catch {
      // silent fail
    } finally {
      setDeletingEmail(null);
    }
  };

  const statusLabel = (status: UserListItem["account"]) =>
    t(`userManagement.users.status.${status}`);

  return (
    <UserManagementContainer>
      {/* Formularz zapraszania */}
      <InviteSection onSubmit={handleInvite}>
        <FormLabel htmlFor="invite-email">
          {t("userManagement.invite.label")}
        </FormLabel>
        <InviteInputWrapper>
          <Input
            id="invite-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("userManagement.invite.placeholder")}
            required
            disabled={isInviting}
          />
          <FormButton type="submit" disabled={isInviting || !email}>
            {isInviting ? "..." : t("userManagement.invite.button")}
          </FormButton>
        </InviteInputWrapper>
        <MessageWrapper $isVisible={!!message}>
          <Message $isError={message?.isError || false}>
            {message?.text}
          </Message>
        </MessageWrapper>
      </InviteSection>

      {/* Lista wszystkich użytkowników */}
      <div>
        <SubTitle>{t("userManagement.users.title")}</SubTitle>
        {isLoadingUsers ? (
          <StyledSpan $comment>{t("userManagement.users.loading")}</StyledSpan>
        ) : users.length === 0 ? (
          <StyledSpan $comment>{t("userManagement.users.empty")}</StyledSpan>
        ) : (
          <StyledList>
            {users.map((user) => (
              <StyledListItem
                key={user.email}
                style={{ padding: 0, border: "none" }}
              >
                <UsersListItem>
                  <UserInfo>
                    <UserEmail>{user.email}</UserEmail>
                    <UserStatusBadge $status={user.account}>
                      {statusLabel(user.account)}
                    </UserStatusBadge>
                  </UserInfo>
                  <DeleteButton
                    type="button"
                    $isConfirm={confirmDeleteEmail === user.email}
                    disabled={deletingEmail === user.email}
                    onClick={() => handleDelete(user.email)}
                    onBlur={() => {
                      if (confirmDeleteEmail === user.email) {
                        setConfirmDeleteEmail(null);
                      }
                    }}
                  >
                    {deletingEmail === user.email
                      ? "..."
                      : confirmDeleteEmail === user.email
                        ? t("userManagement.users.deleteConfirm")
                        : t("userManagement.users.deleteButton")}
                  </DeleteButton>
                </UsersListItem>
              </StyledListItem>
            ))}
          </StyledList>
        )}
      </div>

      {/* Lista zalogowanych użytkowników */}
      <div>
        <SubTitle>{t("activeUsers.label")}</SubTitle>
        <StyledList>
          {presenceUsers.map(({ email: presenceEmail, deviceCount }) => (
            <StyledListItem key={presenceEmail}>
              <StyledListContent>
                <StyledSpan $ListName>{presenceEmail}</StyledSpan>
                <br />
                <StyledSpan $comment>
                  {t("userDeviceCount.device", { count: deviceCount })}
                </StyledSpan>
              </StyledListContent>
            </StyledListItem>
          ))}
          {presenceUsers.length === 0 && (
            <StyledListItem>
              <StyledSpan $comment>Brak aktywnych sesji</StyledSpan>
            </StyledListItem>
          )}
        </StyledList>
      </div>
    </UserManagementContainer>
  );
};

import { useState, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../hooks/redux/redux";
import {
  selectAllDevicesCount,
  selectPresenceUsers,
  selectTotalUsersCount,
} from "../accountSlice";
import {
  UserManagementContainer,
  SummaryGrid,
  InviteSection,
  InviteInputWrapper,
  FormLabel,
  Message,
  SubTitle,
  SummaryItem,
  SummaryTextWrapper,
  SummaryValue,
  SummaryLabel,
  IconWrapper,
  MessageWrapper,
} from "./styled";
import { Input } from "../../../common/Input";
import { FormButton } from "../../../common/FormButton";
import {
  StyledList,
  StyledListContent,
  StyledListItem,
  StyledSpan,
} from "../../../common/StyledList";
import { inviteUserApi } from "../../../api/backupApi";
import { getUserToken } from "../../../utils/auth/getUserToken";
import { ReactComponent as UserIcon } from "../../../images/user.svg";

export const UserManagement = () => {
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage",
  });
  const totalUsersCount = useAppSelector(selectTotalUsersCount);
  const allDevicesCount = useAppSelector(selectAllDevicesCount);
  const presenceUsers = useAppSelector(selectPresenceUsers);

  const [email, setEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const handleInvite = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsInviting(true);
    setMessage(null);

    try {
      const token = await getUserToken();
      if (token) {
        const response = await inviteUserApi(token, email);
        if (response.success) {
          setMessage({
            text: t("userManagement.invite.success"),
            isError: false,
          });
          setEmail("");
        } else {
          setMessage({
            text: response.message || t("userManagement.invite.error"),
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

  return (
    <UserManagementContainer>
      {/* Podsumowanie użytkowników i urządzeń */}
      <SummaryGrid>
        <SummaryItem>
          <IconWrapper>
            <UserIcon style={{ scale: "0.9" }} />
          </IconWrapper>
          <SummaryTextWrapper>
            <SummaryLabel>{t("activeUsers.summaryLabel")}</SummaryLabel>
            <SummaryValue>{totalUsersCount}</SummaryValue>
          </SummaryTextWrapper>
        </SummaryItem>
        <SummaryItem>
          <IconWrapper>
            <UserIcon style={{ scale: "0.9" }} />
          </IconWrapper>
          <SummaryTextWrapper>
            <SummaryLabel>{t("allDevices.summaryLabel")}</SummaryLabel>
            <SummaryValue>{allDevicesCount}</SummaryValue>
          </SummaryTextWrapper>
        </SummaryItem>
      </SummaryGrid>

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

      {/* Lista zalogowanych użytkowników */}
      <div>
        <SubTitle>{t("activeUsers.label")}</SubTitle>
        <StyledList>
          {presenceUsers.map(({ email, deviceCount }) => (
            <StyledListItem key={email}>
              <StyledListContent>
                <StyledSpan $ListName>{email}</StyledSpan>
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

import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../hooks/redux";
import { selectCurrentUserEmail, selectPresenceUsers } from "../accountSlice";
import {
  StyledList,
  StyledListContent,
  StyledListItem,
  StyledSpan,
} from "../../../common/StyledList";

export const PresenceUsersList = () => {
  const presenceUsers = useAppSelector(selectPresenceUsers);
  const currentUserEmail = useAppSelector(selectCurrentUserEmail);
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage",
  });

  return (
    <StyledList>
      {presenceUsers.map(({ email, deviceCount }) => {
        const isCurrentUser = email === currentUserEmail;

        return (
          <StyledListItem key={email} >
            <StyledListContent >
              <StyledSpan $ListName>
                {isCurrentUser ? <strong>{email}</strong> : email}
              </StyledSpan>
              <br />
              <StyledSpan $comment>
                {t("userDeviceCount.device", { count: deviceCount })}
              </StyledSpan>
            </StyledListContent>
          </StyledListItem>
        );
      })}
    </StyledList>
  );
};

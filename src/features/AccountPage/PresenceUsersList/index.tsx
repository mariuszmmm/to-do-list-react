import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../hooks/redux/redux";
import { selectPresenceUsers } from "../accountSlice";
import { StyledList, StyledListContent, StyledListItem, StyledSpan } from "../../../common/StyledList";

export const PresenceUsersList = () => {
  const presenceUsers = useAppSelector(selectPresenceUsers);
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage",
  });

  return (
    <StyledList>
      {presenceUsers.map(({ email, deviceCount }) => {
        return (
          <StyledListItem key={email}>
            <StyledListContent>
              <StyledSpan $ListName>{email}</StyledSpan>
              <br />
              <StyledSpan $comment>{t("userDeviceCount.device", { count: deviceCount })}</StyledSpan>
            </StyledListContent>
          </StyledListItem>
        );
      })}
    </StyledList>
  );
};

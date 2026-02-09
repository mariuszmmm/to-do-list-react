import { TFunction } from "i18next";
import { StatusState } from "..";
import { getUserToken } from "../../../../utils/auth/getUserToken";
import { restoreAllUsersApi } from "../../../../api/backupApi";
import { translateText } from "../../../../api/translateTextApi";
import i18n from "../../../../utils/i18n";

export const handleRestoreAllUsers = async (
  t: TFunction<"translation", "accountPage.backup">,
  setStatus: (status: StatusState) => void,
) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json,.json";

  input.onchange = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target?.files?.[0];
    if (!file) return;

    try {
      setStatus({
        isLoading: true,
        message: t("restoreAllUsers.processing"),
        messageType: "info",
      });

      const token = await getUserToken();
      if (!token) throw new Error("No user token");

      const fileContent = await file.text();
      const backupData = JSON.parse(fileContent);
      const result = await restoreAllUsersApi(token, backupData);

      if (!result.success || !result.data) throw new Error(result.message);

      const { restored, failed } = result.data;
      setStatus({
        isLoading: false,
        message: t("restoreAllUsers.success", {
          restored,
          failed,
          total: restored + failed,
        }),
        messageType: "success",
      });
    } catch (error: unknown) {
      console.error("[restoreAllUsers]", error);

      const msg = error instanceof Error ? error.message : "";
      console.error("MMM msg:", msg);
      const translatedText = (msg ? await translateText(msg, i18n.language) : null) || t("restoreAllUsers.error");
      setStatus({
        isLoading: false,
        message: translatedText,
        messageType: "error",
      });
    }
  };

  input.click();
};

import { TFunction } from "i18next";
import { StatusState } from "..";
import { getUserToken } from "../../../../utils/getUserToken";
import { restoreUserListsApi } from "../../../../api/backupApi";
import { translateText } from "../../../../api/translateTextApi";
import i18n from "../../../../utils/i18n";

export const handleRestoreUserLists = async (
  t: TFunction<"translation", "accountPage.backup">,
  setStatus: (status: StatusState) => void,
) => {
  try {
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
          message: t("restoreUserLists.processing"),
          messageType: "info",
        });

        const token = await getUserToken();
        if (!token) throw new Error("No user token");

        const fileContent = await file.text();
        const backupData = JSON.parse(fileContent);
        const result = await restoreUserListsApi(token, backupData);

        if (!result.success || !result.data) {
          throw new Error(result.message);
        }

        const { listsCount } = result.data;
        setStatus({
          isLoading: false,
          message: t("restoreUserLists.success", {
            count: listsCount,
          }),
          messageType: "success",
        });
      } catch (error: unknown) {
        console.error("[restoreUserLists]", error);
        const msg = error instanceof Error ? error.message : "";
        const translatedText =
          (msg ? await translateText(msg, i18n.language) : null) ||
          t("restoreUserLists.error");
        setStatus({
          isLoading: false,
          message: translatedText,
          messageType: "error",
        });
      }
    };

    input.click();
  } catch (error) {
    setStatus({
      isLoading: false,
      message: t("restoreUserLists.error"),
      messageType: "error",
    });
  }
};

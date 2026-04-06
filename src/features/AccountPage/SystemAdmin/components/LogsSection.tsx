import { useTranslation } from "react-i18next";
import { StyledSpan } from "../../../../common/StyledList";
import {
  TopBorderSection,
  SectionTitle,
  LogItem,
  LogHeader,
  LogTitle,
  LogTimestamp,
  LogDetailsText,
  LogStatsSeparator,
} from "../styled";

interface LogsSectionProps {
  logs: any[];
}

export const LogsSection = ({ logs }: LogsSectionProps) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage.systemAdmin",
  });

  return (
    <TopBorderSection>
      <SectionTitle>{t("logs.title")}</SectionTitle>
      {logs.length === 0 ? (
        <StyledSpan $comment>{t("logs.noLogs")}</StyledSpan>
      ) : (
        logs.map((log, index) => (
          <LogItem key={index}>
            <LogHeader>
              <LogTitle $isError={log.status === "error"}>
                {(() => {
                  const key = log.key
                    .replace("last", "")
                    .replace("Status", "")
                    .replace("log_", "")
                    .replace(/_\d+$/, "")
                    .toLowerCase();

                  const icons: Record<string, string> = {
                    autobackup: "🤖",
                    manualbackup: "💾",
                    backup_disk_all: "📦",
                    backup_disk_user: "👤",
                    restore_gd: "☁️",
                    restore_disk: "📂",
                    cleanup: "🔍",
                    cleanup_temp: "🗑️",
                    cleanup_tasks: "💨",
                    oauth: "🔑",
                    user_invite: "✉️",
                  };

                  return (
                    <>
                      <span>{icons[key] || "📝"}</span>
                      {t(`logs.types.${key}`, key.toUpperCase())}
                    </>
                  );
                })()}
              </LogTitle>
              <LogTimestamp>
                {new Date(log.timestamp).toLocaleTimeString()}
              </LogTimestamp>
            </LogHeader>
            <LogDetailsText>
              {log.details ||
                (log.status === "success" ? t("logs.success") : "No details")}
            </LogDetailsText>
            {log.stats &&
              (log.key.startsWith("log_cleanup") ||
                log.key.includes("cleanup")) && (
                <LogStatsSeparator>
                  {log.key.includes("cleanup_tasks")
                    ? t("database.results.modifiedCount")
                    : log.key.includes("cleanup_logs")
                      ? t("database.results.deletedCount")
                      : t("storage.results.cleaned")}
                  :{" "}
                  <strong>
                    {log.key.includes("cleanup_logs")
                      ? log.stats.deleted
                      : log.stats.cleaned}
                  </strong>
                  {log.stats.orphansFound !== undefined && (
                    <>
                      {" "}
                      | {t("storage.results.orphansFound")}:{" "}
                      <strong>{log.stats.orphansFound}</strong>
                    </>
                  )}
                </LogStatsSeparator>
              )}
          </LogItem>
        ))
      )}
    </TopBorderSection>
  );
};

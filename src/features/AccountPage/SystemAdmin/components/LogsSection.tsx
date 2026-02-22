import { useTranslation } from "react-i18next";
import { StyledSpan } from "../../../../common/StyledList";
import {
  TopBorderSection,
  SectionTitle,
  LogItem,
  LogHeader,
  LogTitle,
  InfoSpan,
  LogDetails,
  LogStats,
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
                  };

                  return (
                    <>
                      <span>{icons[key] || "📝"}</span>
                      {t(`logs.types.${key}`, key.toUpperCase())}
                    </>
                  );
                })()}
              </LogTitle>
              <InfoSpan $opacity={0.5} style={{ fontSize: "0.8rem" }}>
                {new Date(log.timestamp).toLocaleTimeString()}
              </InfoSpan>
            </LogHeader>
            <LogDetails style={{ fontSize: "0.85rem", marginTop: "4px" }}>
              {log.details || "No details"}
            </LogDetails>
            {log.stats && log.key.startsWith("log_cleanup") && (
              <LogStats
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  paddingTop: "4px",
                  marginTop: "6px",
                }}
              >
                {t("storage.results.cleaned", "Cleaned")}:{" "}
                <strong>{log.stats.cleaned}</strong>{" "}
                {log.stats.orphansFound !== undefined &&
                  `| ${t("storage.results.orphansFound", "Found")}: ${log.stats.orphansFound}`}
              </LogStats>
            )}
          </LogItem>
        ))
      )}
    </TopBorderSection>
  );
};

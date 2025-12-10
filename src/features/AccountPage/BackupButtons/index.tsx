import { useState, useEffect } from "react";
import { ButtonsContainer } from "../../../common/ButtonsContainer";
import { Button } from "../../../common/Button";
import { Info } from "../../../common/Info";
import { useTranslation } from "react-i18next";
import { getUserToken } from "../../../utils/getUserToken";
import {
  downloadBackupApi,
  saveBackupToFile,
  uploadBackupToGoogleDriveApi,
  restoreBackupFromGoogleDriveApi,
  restoreBackupFromFileApi,
  getGoogleOAuthUrl,
  listGoogleDriveBackupsApi,
  deleteBackupFromGoogleDriveApi,
} from "../../../api/backupApi";
import { RemoveButton } from "../../../common/taskButtons";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { openModal, closeModal, selectModalConfirmed } from "../../../Modal/modalSlice";
import { BackupListContainer } from "../../../common/BackupListContainer";
import {
  BackupListTitle,
  BackupItem,
  BackupFileName,
  BackupFileDate,
  BackupFileInfo,
  BackupActionsContainer,
  MessageContainer,
  BackupItemsContainer,
  PaginationContainer,
  PaginationButton,
  PaginationInfo,
} from "./styled";
import { ArrowIcon } from "./styled";

export const BackupButtons = () => {
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage.backup",
  });
  const dispatch = useAppDispatch();
  const confirmed = useAppSelector(selectModalConfirmed);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [showGoogleAuth, setShowGoogleAuth] = useState(!googleAccessToken);
  const [backupFiles, setBackupFiles] = useState<Array<{ id: string; name: string; modifiedTime: string }>>([]);
  const [showBackupList, setShowBackupList] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [fileToDelete, setFileToDelete] = useState<{ id: string; name: string } | null>(null);
  const itemsPerPage = 5;

  // Check for Google token in localStorage and OAuth callback
  useEffect(() => {
    const storedToken = localStorage.getItem("google_drive_access_token");
    if (storedToken) {
      setGoogleAccessToken(storedToken);
      setShowGoogleAuth(false);
    }

    // Check if returning from OAuth callback (code stored in sessionStorage by App.tsx)
    const code = sessionStorage.getItem("google_oauth_code");
    if (code) {
      sessionStorage.removeItem("google_oauth_code");
      // OAuth callback will be handled inline
      (async () => {
        try {
          setIsLoading(true);
          setMessage(t("processingAuthorization"));
          setMessageType("info");

          process.env.NODE_ENV === "development" && console.log("[OAuth] Received code:", code);

          // Exchange authorization code for access token
          const response = await fetch("/google-oauth-callback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          });

          process.env.NODE_ENV === "development" && console.log("[OAuth] Response status:", response.status);

          if (!response.ok) {
            const errorData = await response.json();
            console.error("[OAuth] Error response:", errorData);
            throw new Error(errorData.message || "Failed to authorize Google Drive");
          }

          const data = await response.json();
          process.env.NODE_ENV === "development" && console.log("[OAuth] Token exchange successful:", data);

          // Store the access token
          localStorage.setItem("google_drive_access_token", data.accessToken);
          if (data.refreshToken) {
            localStorage.setItem("google_drive_refresh_token", data.refreshToken);
          }

          // Update state
          setGoogleAccessToken(data.accessToken);
          setShowGoogleAuth(false);

          setMessage(t("googleDriveAuthSuccess"));
          setMessageType("success");
        } catch (error) {
          console.error("[OAuth] Error:", error);
          setMessage(error instanceof Error ? error.message : "Authorization failed");
          setMessageType("error");
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, []);

  useEffect(() => {
    const storedMessage = sessionStorage.getItem("backup_flash_message");
    const storedMessageType = sessionStorage.getItem("backup_flash_type") as
      | "success"
      | "error"
      | "info"
      | null;

    if (storedMessage) {
      setMessage(storedMessage);
      setMessageType(storedMessageType || "info");
      sessionStorage.removeItem("backup_flash_message");
      sessionStorage.removeItem("backup_flash_type");
    }
  }, []);

  const handleDownloadBackup = async () => {
    try {
      process.env.NODE_ENV === "development" && console.log("[Download] Starting backup download");
      setIsLoading(true);
      setMessage(t("downloading"));
      setMessageType("info");

      const token = await getUserToken();
      if (!token) {
        setMessage(t("downloadError"));
        setMessageType("error");
        return;
      }

      const backupData = await downloadBackupApi(token);
      process.env.NODE_ENV === "development" && console.log("[Download] Backup data received:", backupData ? "success" : "failed");

      if (!backupData) {
        setMessage(t("downloadError"));
        setMessageType("error");
        return;
      }

      const saved = saveBackupToFile(backupData);
      process.env.NODE_ENV === "development" && console.log("[Download] File save result:", saved);

      if (saved) {
        setMessage(t("downloadSuccess"));
        setMessageType("success");
      } else {
        setMessage(t("savingError"));
        setMessageType("error");
      }
    } catch (error) {
      console.error("[Download] Error:", error);
      setMessage(error instanceof Error ? error.message : t("downloadError"));
      setMessageType("error");
    } finally {
      setIsLoading(false);
      process.env.NODE_ENV === "development" && console.log("[Download] Completed");
    }
  };

  const handleAuthorizeGoogle = () => {
    try {
      sessionStorage.setItem("open_backup_after_oauth", "true");
      const oauthUrl = getGoogleOAuthUrl();
      if (!oauthUrl) {
        setMessage(t("configError"));
        setMessageType("error");
        return;
      }
      window.location.href = oauthUrl;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t("authError"));
      setMessageType("error");
    }
  };

  const handleUploadToGoogleDrive = async () => {
    try {
      setIsLoading(true);
      setMessage(t("uploading"));
      setMessageType("info");

      if (!googleAccessToken) {
        setMessage(t("notAuthorized"));
        setMessageType("error");
        setShowGoogleAuth(true);
        return;
      }

      setIsLoading(true);
      setMessage(t("uploading"));
      setMessageType("info");

      const token = await getUserToken();
      if (!token) {
        setMessage(t("downloadError"));
        setMessageType("error");
        return;
      }

      const backupData = await downloadBackupApi(token);

      if (!backupData) {
        setMessage(t("downloadError"));
        setMessageType("error");
        return;
      }

      const result = await uploadBackupToGoogleDriveApi(
        token,
        backupData,
        googleAccessToken
      );

      if (result.success) {
        setMessage(t("uploadSuccess"));
        setMessageType("success");
      } else {
        setMessage(result.message);
        setMessageType("error");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t("uploadError"));
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreFromGoogleDrive = async () => {
    try {
      setIsLoading(true);
      setMessage(t("restoring"));
      setMessageType("info");

      if (!googleAccessToken) {
        setMessage(t("notAuthorized"));
        setMessageType("error");
        setShowGoogleAuth(true);
        return;
      }

      const token = await getUserToken();
      if (!token) {
        setMessage(t("downloadError"));
        setMessageType("error");
        return;
      }

      // List backup files from Google Drive
      const listResult = await listGoogleDriveBackupsApi(googleAccessToken);

      if (!listResult.success || !listResult.files || listResult.files.length === 0) {
        setMessage(t("noBackups"));
        setMessageType("error");
        return;
      }

      // Show list of backups for user to choose
      setBackupFiles(listResult.files);
      setShowBackupList(true);
      setMessage(t("selectBackup"));
      setMessageType("info");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t("restoreError"));
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreSelectedBackup = async (fileId: string, fileName: string) => {
    try {
      setIsLoading(true);
      setShowBackupList(false);
      setMessage(`${t("restoring")}: ${fileName}`);
      setMessageType("info");

      const token = await getUserToken();
      if (!token) {
        setMessage(t("downloadError"));
        setMessageType("error");
        return;
      }

      const result = await restoreBackupFromGoogleDriveApi(
        token,
        fileId,
        googleAccessToken!
      );

      if (result.success) {
        setMessage(
          t("restoreSuccess", { count: result.listsCount || 0 })
        );
        setMessageType("success");
        sessionStorage.setItem(
          "backup_flash_message",
          t("restoreSuccess", { count: result.listsCount || 0 })
        );
        sessionStorage.setItem("backup_flash_type", "success");
        // Reload page to reflect changes
        sessionStorage.setItem("open_backup_after_oauth", "true");
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setMessage(result.message);
        setMessageType("error");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t("restoreError"));
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreFromFile = async () => {
    try {
      // Create file input element
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json,.json";

      input.onchange = async (e: any) => {
        const file = e.target?.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setMessage(t("restoring"));
        setMessageType("info");

        try {
          const token = await getUserToken();
          if (!token) {
            setMessage(t("downloadError"));
            setMessageType("error");
            return;
          }

          // Read file content
          const fileContent = await file.text();
          const backupData = JSON.parse(fileContent);

          // Restore backup
          const result = await restoreBackupFromFileApi(token, backupData);

          if (result.success) {
            setMessage(
              t("restoreSuccess", { count: result.listsCount || 0 })
            );
            setMessageType("success");
            sessionStorage.setItem(
              "backup_flash_message",
              t("restoreSuccess", { count: result.listsCount || 0 })
            );
            sessionStorage.setItem("backup_flash_type", "success");
            // Reload page to reflect changes
            sessionStorage.setItem("open_backup_after_oauth", "true");
            setTimeout(() => window.location.reload(), 1000);
          } else {
            setMessage(result.message);
            setMessageType("error");
          }
        } catch (error) {
          setMessage(error instanceof Error ? error.message : t("restoreError"));
          setMessageType("error");
        } finally {
          setIsLoading(false);
        }
      };

      input.click();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t("restoreError"));
      setMessageType("error");
    }
  };

  const handleDeleteBackup = async (fileId: string, fileName: string) => {
    try {
      process.env.NODE_ENV === "development" && console.log("[Delete] Starting delete for file:", fileName, "ID:", fileId);
      setIsLoading(true);
      setMessage(`${t("deleteBackup.deleting")}: ${fileName}`);
      setMessageType("info");

      if (!googleAccessToken) {
        process.env.NODE_ENV === "development" && console.log("[Delete] No Google access token available");
        setMessage(t("notAuthorized"));
        setMessageType("error");
        return;
      }

      process.env.NODE_ENV === "development" && console.log("[Delete] Calling deleteBackupFromGoogleDriveApi");
      const result = await deleteBackupFromGoogleDriveApi(
        googleAccessToken,
        fileId
      );

      process.env.NODE_ENV === "development" && console.log("[Delete] API result:", result);

      if (result.success) {
        process.env.NODE_ENV === "development" && console.log("[Delete] Deletion successful, refreshing list");
        setMessage(t("deleteBackup.success"));
        setMessageType("success");
        // Refresh the backup list
        const listResult = await listGoogleDriveBackupsApi(googleAccessToken);
        process.env.NODE_ENV === "development" && console.log("[Delete] List refresh result:", listResult);

        if (listResult.success && listResult.files) {
          setBackupFiles(listResult.files);
          setCurrentPage(1);
        }
        return true;
      } else {
        process.env.NODE_ENV === "development" && console.log("[Delete] Deletion failed:", result.message);
        setMessage(result.message);
        setMessageType("error");
        return false;
      }
    } catch (error) {
      console.error("[Delete] Exception caught:", error);
      setMessage(
        error instanceof Error ? error.message : t("deleteBackup.error")
      );
      setMessageType("error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBackupConfirmation = (fileId: string, fileName: string) => {
    setFileToDelete({ id: fileId, name: fileName });
    dispatch(
      openModal({
        title: { key: "modal.deleteBackup.title" },
        message: {
          key: "modal.deleteBackup.message.confirm",
          values: { name: fileName },
        },
        type: "confirm",
        confirmButton: { key: "modal.buttons.deleteButton" },
      })
    );
  };

  useEffect(() => {
    if (!fileToDelete) return;
    if (confirmed) {
      // show loading while deleting
      dispatch(
        openModal({
          title: { key: "modal.deleteBackup.title" },
          message: { key: "modal.deleteBackup.message.loading" },
          type: "loading",
        })
      );
      handleDeleteBackup(fileToDelete.id, fileToDelete.name).then((ok) => {
        dispatch(
          openModal({
            title: { key: "modal.deleteBackup.title" },
            message: {
              key: ok
                ? "modal.deleteBackup.message.success"
                : "modal.deleteBackup.message.error.default",
            },
            type: ok ? "success" : "error",
          })
        );
        setFileToDelete(null);
      });
    } else if (confirmed === false) {
      setFileToDelete(null);
      dispatch(closeModal());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileToDelete, confirmed]);

  return (
    <div>
      {/* Backup Files List */}
      {showBackupList && backupFiles.length > 0 ? (
        <BackupListContainer>
          <BackupListTitle>{t("selectBackup")}</BackupListTitle>
          <BackupItemsContainer>
            {backupFiles
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((file) => (
                <BackupItem
                  key={file.id}
                  onClick={() => !isLoading && handleRestoreSelectedBackup(file.id, file.name)}
                  style={{
                    opacity: isLoading ? 0.6 : 1,
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                >
                  <BackupFileInfo>
                    <BackupFileName>{file.name}</BackupFileName>
                    <BackupFileDate>
                      🕐 {new Date(file.modifiedTime).toLocaleString("pl-PL", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </BackupFileDate>
                  </BackupFileInfo>
                  <RemoveButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBackupConfirmation(file.id, file.name);
                    }}
                    disabled={isLoading}
                    title={t("deleteBackup.tooltip")}
                  >
                    🗑️
                  </RemoveButton>
                </BackupItem>
              ))}
          </BackupItemsContainer>
          <BackupActionsContainer>
            {Math.ceil(backupFiles.length / itemsPerPage) > 1 && (
              <PaginationContainer>
                <PaginationButton
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1 || isLoading}
                >
                  <ArrowIcon $left>➜</ArrowIcon>
                  {t("prev")}
                </PaginationButton>
                <PaginationInfo>
                  {currentPage} / {Math.ceil(backupFiles.length / itemsPerPage)}
                </PaginationInfo>
                <PaginationButton
                  onClick={() =>
                    setCurrentPage(
                      Math.min(
                        Math.ceil(backupFiles.length / itemsPerPage),
                        currentPage + 1
                      )
                    )
                  }
                  disabled={
                    currentPage === Math.ceil(backupFiles.length / itemsPerPage) ||
                    isLoading
                  }
                >
                  {t("next")}
                  <ArrowIcon>➜</ArrowIcon>
                </PaginationButton>
              </PaginationContainer>
            )}
            <PaginationButton
              $cancel
              onClick={() => {
                setShowBackupList(false);
                setMessage("");
                setCurrentPage(1);
              }}
              disabled={isLoading}
            >
              ✖ {t("cancel")}
            </PaginationButton>
          </BackupActionsContainer>
        </BackupListContainer>
      ) : (
        <>
          <MessageContainer>
            {message && (
              <Info $warning={messageType === "error"}>
                {message}
              </Info>
            )}
          </MessageContainer>

          <ButtonsContainer $extra>
            <Button
              onClick={handleDownloadBackup}
              disabled={isLoading}
              title={t("downloadTooltip")}
            >
              📥 {t("download")}
            </Button>

            <Button
              onClick={handleRestoreFromFile}
              disabled={isLoading}
              title={t("restoreFromComputerTooltip")}
            >
              📂 {t("restoreFromComputer")}
            </Button>

            <Button
              onClick={handleUploadToGoogleDrive}
              disabled={isLoading || showGoogleAuth}
              title={showGoogleAuth ? t("authorizeGoogleTooltip") : t("uploadTooltip")}
            >
              ☁️ {t("upload")}
            </Button>

            <Button
              onClick={handleRestoreFromGoogleDrive}
              disabled={isLoading || showGoogleAuth}
              title={showGoogleAuth ? t("authorizeGoogleTooltip") : t("restoreTooltip")}
            >
              ☁️ {t("restore")}
            </Button>
          </ButtonsContainer>

          {showGoogleAuth && (
            <ButtonsContainer $extra>
              <Button
                onClick={handleAuthorizeGoogle}
                disabled={isLoading}
                title={t("authorizeGoogleTooltip")}
              >
                {t("authorizeGoogle")}
              </Button>
            </ButtonsContainer>
          )}
        </>
      )}
    </div>
  );
};

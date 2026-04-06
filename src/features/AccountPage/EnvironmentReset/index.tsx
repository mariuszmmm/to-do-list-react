import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux/redux";
import { closeModal, openModal, selectModalConfirmed } from "../../../Modal/modalSlice";
import { Button } from "../../../common/Button";
import { resetNotifications } from "../../../utils/notifications/notificationReset";
import { 
  ResetContainer, 
  OperationsList, 
  OperationItem, 
  OperationsTitle 
} from "./styled";

/**
 * Komponent EnvironmentReset z poprawioną obsługą potwierdzenia
 * i listą operacji wyświetlaną pod przyciskiem.
 */
export const EnvironmentReset = () => {
  const dispatch = useAppDispatch();
  const confirmed = useAppSelector(selectModalConfirmed);
  const { t } = useTranslation();
  
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleConfirmation = async () => {
      if (!isProcessing) return;

      if (confirmed === true) {
        dispatch(closeModal());
        
        try {
          await resetNotifications();
          window.location.reload();
        } catch (error) {
          // Błąd jest ignorowany przy resecie, bo i tak przeładowujemy stronę
        } finally {
          setIsProcessing(false);
        }
      } else if (confirmed === false) {
        dispatch(closeModal());
        setIsProcessing(false);
      }
    };

    handleConfirmation();
  }, [confirmed, isProcessing, dispatch]);

  const handleTrigger = () => {
    setIsProcessing(true);
    dispatch(
      openModal({
        title: { key: "modal.environmentReset.title" },
        message: { key: "modal.environmentReset.warningBody" },
        confirmButton: { key: "modal.buttons.environmentResetConfirm" },
        type: "confirm",
      })
    );
  };

  return (
    <ResetContainer>
      <Button 
        onClick={handleTrigger} 
        $danger 
        disabled={isProcessing}
        title={t("modal.buttons.environmentResetTrigger")}
      >
        {isProcessing ? t("modal.buttons.loading") : t("modal.buttons.environmentResetTrigger")}
      </Button>
      
      <div>
        <OperationsTitle>{t("modal.environmentReset.operationsTitle")}</OperationsTitle>
        <OperationsList>
          <OperationItem>{t("modal.environmentReset.operations.sw")}</OperationItem>
          <OperationItem>{t("modal.environmentReset.operations.cache")}</OperationItem>
          <OperationItem>{t("modal.environmentReset.operations.indexedDB")}</OperationItem>
          <OperationItem>{t("modal.environmentReset.operations.storage")}</OperationItem>
          <OperationItem>{t("modal.environmentReset.operations.cookies")}</OperationItem>
          <OperationItem>{t("modal.environmentReset.operations.reload")}</OperationItem>
        </OperationsList>
      </div>
    </ResetContainer>
  );
};

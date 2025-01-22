import { Modal } from "../../../common/Modal";
import { RecoveryStatus } from "../../../types";

export const AccountRecoveryModal = ({
  recoveryStatus,
}: {
  recoveryStatus: RecoveryStatus;
}) => (
  <>
    {recoveryStatus !== "resetPassword" && (
      <Modal
        title="Odzyskiwanie hasła"
        description={
          recoveryStatus === "recovering" || recoveryStatus === "savePassword"
            ? "Proszę czekać..."
            : recoveryStatus === "passwordUpdated"
            ? "Hasło zostało zaktualizowane, zamknij stronę"
            : recoveryStatus === "passwordNotUpdated"
            ? "Wystąpił błąd podczas aktualizacji hasła"
            : "Link wygasł lub został użyty"
        }
        status={
          recoveryStatus === "recovering" || recoveryStatus === "savePassword"
            ? "loading"
            : recoveryStatus === "passwordUpdated"
            ? "check"
            : recoveryStatus === "passwordNotUpdated" ||
              recoveryStatus === "linkExpired"
            ? "warning"
            : undefined
        }
      />
    )}
  </>
);

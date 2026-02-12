import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux/redux";
import { closeModal, openModal, selectModalConfirmed } from "../../../../Modal/modalSlice";
import { ModalTranslationKeys } from "../../../../@types/i18next";
import langPl from "../../../../utils/i18n/locales/pl";

interface UseConfirmRemoveActionProps {
  onConfirm: () => Promise<void> | void;
  onCancel?: () => void;
  title: { key: ModalTranslationKeys<typeof langPl, "modal"> } | null;
  message: { key: ModalTranslationKeys<typeof langPl, "modal">; values?: Record<string, string> } | string;
  confirmButtonLabel?: { key: ModalTranslationKeys<typeof langPl, "modal.buttons"> };
}

export const useConfirmRemoveAction = ({
  onConfirm,
  onCancel,
  title,
  message,
  confirmButtonLabel,
}: UseConfirmRemoveActionProps) => {
  const dispatch = useAppDispatch();
  const confirmed = useAppSelector(selectModalConfirmed);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const handleConfirmation = async () => {
      if (!isPending) return;
      if (confirmed === null) return;

      if (confirmed === true) {
        dispatch(closeModal());
        try {
          await onConfirm();
        } finally {
          setIsPending(false);
        }
      } else if (confirmed === false) {
        dispatch(closeModal());
        setIsPending(false);
        onCancel?.();
      }
    };

    handleConfirmation();
  }, [isPending, confirmed, dispatch, onConfirm, onCancel]);

  const trigger = () => {
    setIsPending(true);
    dispatch(
      openModal({
        title,
        message,
        type: "confirm",
        confirmButton: confirmButtonLabel,
      }),
    );
  };

  return { trigger, isPending };
};

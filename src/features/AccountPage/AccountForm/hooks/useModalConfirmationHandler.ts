import { useEffect } from "react";
import { useAppDispatch } from "../../../../hooks/redux/redux";
import { setAccountMode } from "../../accountSlice";
import { clearStorage } from "../../../tasks/tasksSlice";
import { closeModal, openModal } from "../../../../Modal/modalSlice";
import { UseMutationResult } from "@tanstack/react-query";

interface UseModalConfirmationHandlerProps {
  confirmed: boolean | null | undefined;
  modalState: any;
  accountMode: string;
  logout: UseMutationResult<any, any, void, unknown>;
  accountDelete: UseMutationResult<any, any, void, unknown>;
}

export const useModalConfirmationHandler = ({
  confirmed,
  modalState,
  accountMode,
  logout,
  accountDelete,
}: UseModalConfirmationHandlerProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const modalTitleKey = modalState.title?.key;
    const isAccountConfirmModal =
      modalState.type === "confirm" &&
      (modalTitleKey === "modal.logout.title" ||
        modalTitleKey === "modal.accountDelete.title" ||
        modalTitleKey === "modal.dataRemoval.title");

    if (!isAccountConfirmModal) return;

    if (confirmed) {
      if (modalTitleKey === "modal.logout.title" && accountMode === "logged") {
        logout.mutate();
      }
      if (modalTitleKey === "modal.accountDelete.title" && accountMode === "accountDelete") {
        accountDelete.mutate();
      }
      if (modalTitleKey === "modal.dataRemoval.title" && accountMode === "dataRemoval") {
        dispatch(clearStorage());
        dispatch(setAccountMode("login"));
        dispatch(
          openModal({
            title: { key: "modal.dataRemoval.title" },
            message: { key: "modal.dataRemoval.message.info" },
            type: "info",
          }),
        );
      }
    } else if (confirmed === false) {
      if (modalTitleKey === "modal.accountDelete.title" && accountMode === "accountDelete") {
        dispatch(setAccountMode("logged"));
      }
      if (modalTitleKey === "modal.dataRemoval.title" && accountMode === "dataRemoval") {
        dispatch(setAccountMode("login"));
      }
      dispatch(closeModal());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmed, modalState, accountMode]);
};

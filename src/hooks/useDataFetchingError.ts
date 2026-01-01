import { useEffect, useState } from "react";
import { QueryObserverResult } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "./redux";
import {
  closeModal,
  openModal,
  selectModalIsOpen,
  selectModalType,
} from "../Modal/modalSlice";

interface DataFetchingErrorParams {
  isError: boolean;
  isData: boolean;
  refetch?: () => Promise<QueryObserverResult>;
}

/**
 * Hook for handling data fetching errors and displaying error modal with retry logic.
 * Opens an error modal on fetch error and retries fetching after a delay.
 */
export const useDataFetchingError = ({
  isError,
  isData,
  refetch,
}: DataFetchingErrorParams) => {
  const [openModalDelay, setOpenModalDelay] = useState(0);
  const isModalOpen = useAppSelector(selectModalIsOpen);
  const modalType = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isError) {
      // Show error modal and start retry countdown if not already open
      if (!isModalOpen && openModalDelay <= 0) {
        dispatch(
          openModal({
            title: { key: "modal.listsDownload.title" },
            message: { key: "modal.listsDownload.message.error.default" },
            type: "error",
          })
        );
        setOpenModalDelay(10);
      }
      console.log("openModalDelay:", openModalDelay);
      // Retry fetching data after 20 seconds if refetch is provided
      if (refetch) {
        timer = setTimeout(() => {
          refetch();
          if (!isModalOpen) {
            setOpenModalDelay((prev) => prev - 1);
          }
        }, 20 * 1000);
      }
    } else if (modalType === "error" && isData) {
      // Close error modal if data is available again
      dispatch(closeModal());
      setOpenModalDelay(0);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, isData]);
};

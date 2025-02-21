import {
  CircleCheckIcon,
  CircleInfoIcon,
  CircleLoadingIcon,
  CircleWarningIcon,
} from "../common/icons";
import { useAppDispatch, useAppSelector } from "../hooks";
import { cancel, closeModal, confirm, selectModalState } from "./modalSlice";
import {
  ModalBackground,
  ModalBody,
  ModalButtonContainer,
  ModalConfirmButton,
  ModalContainer,
  ModalDescription,
  ModalHeader,
  HeaderContent,
  ModalCloseButton,
  ModalCancelButton,
} from "./styled";

export const Modal = () => {
  const { isOpen, title, message, confirmButtonText, endButtonText, type } =
    useAppSelector(selectModalState);
  const dispatch = useAppDispatch();

  if (!isOpen) return null;

  return (
    <ModalBackground>
      <ModalContainer>
        <ModalBody>
          <ModalHeader>
            {type === "info" && <CircleInfoIcon />}
            {type === "success" && <CircleCheckIcon />}
            {type === "loading" && <CircleLoadingIcon />}
            {(type === "confirm" || type === "error") && <CircleWarningIcon />}
            <HeaderContent>{title}</HeaderContent>
          </ModalHeader>
          <ModalDescription>{message}</ModalDescription>
          {
            <ModalButtonContainer>
              {type === "confirm" ? (
                <>
                  <ModalCancelButton onClick={() => dispatch(cancel())}>
                    Anuluj
                  </ModalCancelButton>
                  <ModalConfirmButton onClick={() => dispatch(confirm())}>
                    {confirmButtonText || "Potwierdz"}
                  </ModalConfirmButton>
                </>
              ) : (
                <ModalCloseButton
                  onClick={() => dispatch(closeModal())}
                  disabled={type === "loading"}
                >
                  {endButtonText || "Zamknij"}
                </ModalCloseButton>
              )}
            </ModalButtonContainer>
          }
        </ModalBody>
      </ModalContainer>
    </ModalBackground>
  );
};

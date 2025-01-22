import {
  CircleCheckIcon,
  CircleInfoIcon,
  CircleLoadingIcon,
  CircleWarningIcon,
} from "../icons";
import {
  ModalBackground,
  ModalBody,
  ModalButtonCancel,
  ModalButtonClose,
  ModalButtonContainer,
  ModalButtonDelete,
  ModalContainer,
  ModalDescription,
  ModalHeader,
  HeaderContent,
} from "./styled";

interface ModalProps {
  title: string;
  description: string;
  status?: "check" | "info" | "warning" | "loading";
  close?: () => void;
  cancel?: () => void;
  remove?: () => void;
  disabledButtons?: boolean;
}

export const Modal = ({
  title,
  description,
  status,
  close,
  cancel,
  remove,
  disabledButtons,
}: ModalProps) => {
  return (
    <ModalBackground>
      <ModalContainer>
        <ModalBody>
          <ModalHeader>
            {status === "info" && <CircleInfoIcon />}
            {status === "check" && <CircleCheckIcon />}
            {status === "loading" && <CircleLoadingIcon />}
            {status === "warning" && <CircleWarningIcon />}
            <HeaderContent>{title}</HeaderContent>
          </ModalHeader>
          <ModalDescription>{description}</ModalDescription>
          {(close || cancel || remove) && (
            <ModalButtonContainer>
              {close && (
                <ModalButtonClose onClick={close} disabled={disabledButtons}>
                  Zamknij
                </ModalButtonClose>
              )}
              {cancel && (
                <ModalButtonCancel onClick={cancel} disabled={disabledButtons}>
                  Anuluj
                </ModalButtonCancel>
              )}
              {remove && (
                <ModalButtonDelete onClick={remove} disabled={disabledButtons}>
                  Usuń
                </ModalButtonDelete>
              )}
            </ModalButtonContainer>
          )}
        </ModalBody>
      </ModalContainer>
    </ModalBackground>
  );
};

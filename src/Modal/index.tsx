import { Trans, useTranslation } from "react-i18next";
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
  const { isOpen, title, message, confirmButton, endButton, type } =
    useAppSelector(selectModalState);
  const { t } = useTranslation();
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
          {message && (
            <ModalDescription>
              <Trans
                i18nKey={message.key}
                values={message.values}
                components={{ b: <b />, br: <br /> }}
              />
            </ModalDescription>
          )}
          {
            <ModalButtonContainer>
              {type === "confirm" ? (
                <>
                  <ModalCancelButton onClick={() => dispatch(cancel())}>
                    {t("modal.buttons.cancelButton")}
                  </ModalCancelButton>
                  <ModalConfirmButton onClick={() => dispatch(confirm())}>
                    {confirmButton || t("modal.buttons.confirmButton")}
                  </ModalConfirmButton>
                </>
              ) : (
                <ModalCloseButton
                  onClick={() => dispatch(closeModal())}
                  disabled={type === "loading"}
                >
                  {endButton || t("modal.buttons.closeButton")}
                </ModalCloseButton>
              )}
            </ModalButtonContainer>
          }
        </ModalBody>
      </ModalContainer>
    </ModalBackground>
  );
};

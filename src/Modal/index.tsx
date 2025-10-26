import { Trans } from "react-i18next";
import {
  CircleCheckIcon,
  CircleInfoIcon,
  CircleLoadingIcon,
  CircleWarningIcon,
} from "../common/icons";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
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
  ModalYesButton,
  ModalNoButton,
} from "./styled";

export const Modal = () => {
  const { isOpen, title, message, confirmButton, endButton, type } =
    useAppSelector(selectModalState);
  const dispatch = useAppDispatch();

  if (!isOpen) return null;

  return (
    <ModalBackground>
      <ModalContainer>
        <ModalBody>

          <ModalHeader>
            {(type === "info" || type === "yes/no") && <CircleInfoIcon />}
            {type === "success" && <CircleCheckIcon />}
            {type === "loading" && <CircleLoadingIcon />}
            {(type === "confirm" || type === "error") && <CircleWarningIcon />}
            {title && (
              <HeaderContent>
                <Trans i18nKey={title.key} />
              </HeaderContent>
            )}
          </ModalHeader>

          {!!message && (
            <ModalDescription>
              {typeof message === "string" ? (
                message
              ) : (
                <Trans i18nKey={message.key} values={message.values} />
              )}
            </ModalDescription>
          )}

          {<ModalButtonContainer>

            {type === "confirm" &&
              <>
                <ModalCancelButton onClick={() => dispatch(cancel())}>
                  <Trans i18nKey="modal.buttons.cancelButton" />
                </ModalCancelButton>
                <ModalConfirmButton onClick={() => dispatch(confirm())}>
                  <Trans
                    i18nKey={
                      confirmButton
                        ? confirmButton.key
                        : "modal.buttons.confirmButton"
                    }
                  />
                </ModalConfirmButton>
              </>
            }

            {type === "yes/no" &&
              <>
                <ModalYesButton onClick={() => dispatch(confirm())}>
                  <Trans i18nKey="modal.buttons.yes" />
                </ModalYesButton>
                <ModalNoButton onClick={() => dispatch(cancel())}>
                  <Trans i18nKey="modal.buttons.no" />
                </ModalNoButton>
              </>
            }

            {type !== "yes/no" && type !== "confirm" &&
              <ModalCloseButton
                onClick={() => dispatch(closeModal())}
                disabled={type === "loading"}
              >
                <Trans
                  i18nKey={
                    endButton ? endButton.key : "modal.buttons.closeButton"
                  }
                />
              </ModalCloseButton>
            }

          </ModalButtonContainer>}
        </ModalBody>
      </ModalContainer>
    </ModalBackground>
  );
};

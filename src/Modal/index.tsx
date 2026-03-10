import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  CircleCheckIcon,
  CircleInfoIcon,
  CircleLoadingIcon,
  CircleWarningIcon,
} from "../common/icons";
import { useAppDispatch, useAppSelector } from "../hooks/redux/redux";
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
  const { t } = useTranslation();
  const { isOpen, title, message, confirmButton, endButton, type } =
    useAppSelector(selectModalState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isClickable =
    type !== "loading" && type !== "confirm" && type !== "yes/no";

  return (
    <ModalBackground
      onClick={() => {
        if (isClickable) {
          dispatch(closeModal());
        }
      }}
      $clickable={isClickable}
    >
      <ModalContainer>
        <ModalBody onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            {(type === "info" || type === "yes/no") && (
              <CircleInfoIcon key="info-icon" />
            )}
            {type === "success" && <CircleCheckIcon key="success-icon" />}
            {type === "loading" && <CircleLoadingIcon key="loading-icon" />}
            {(type === "confirm" || type === "error") && (
              <CircleWarningIcon key="warning-icon" />
            )}
            {title && (
              <HeaderContent key="header-content">{t(title.key)}</HeaderContent>
            )}
          </ModalHeader>

          {!!message && (
            <ModalDescription>
              {typeof message === "string"
                ? message
                : t(message.key, message.values)
                    .split(
                      /(<strong>.*?<\/strong>|<small>.*?<\/small>|<br\s*\/?>)/g,
                    )
                    .map((part, index) => {
                      if (part.startsWith("<strong")) {
                        return (
                          <strong key={index}>
                            {part.replace(/<\/?strong>/g, "")}
                          </strong>
                        );
                      }
                      if (part.startsWith("<small")) {
                        return (
                          <small
                            key={index}
                            style={{ fontSize: "0.85em", opacity: 0.8 }}
                          >
                            {part.replace(/<\/?small>/g, "")}
                          </small>
                        );
                      }
                      if (part.startsWith("<br")) {
                        return <br key={index} />;
                      }
                      return part;
                    })}
            </ModalDescription>
          )}

          <ModalButtonContainer>
            {type === "confirm" && (
              <>
                <ModalCancelButton onClick={() => dispatch(cancel())}>
                  {t("modal.buttons.cancelButton")}
                </ModalCancelButton>
                <ModalConfirmButton onClick={() => dispatch(confirm())}>
                  {t(
                    confirmButton
                      ? confirmButton.key
                      : "modal.buttons.confirmButton",
                  )}
                </ModalConfirmButton>
              </>
            )}

            {type === "yes/no" && (
              <>
                <ModalYesButton onClick={() => dispatch(confirm())}>
                  {t("modal.buttons.yesButton")}
                </ModalYesButton>
                <ModalNoButton onClick={() => dispatch(cancel())}>
                  {t("modal.buttons.noButton")}
                </ModalNoButton>
              </>
            )}

            {type !== "yes/no" && type !== "confirm" && (
              <ModalCloseButton
                onClick={() => dispatch(closeModal())}
                disabled={type === "loading"}
              >
                {t(endButton ? endButton.key : "modal.buttons.closeButton")}
              </ModalCloseButton>
            )}
          </ModalButtonContainer>
        </ModalBody>
      </ModalContainer>
    </ModalBackground>
  );
};

import { useTranslation } from "react-i18next";
import { ModalOverlay, ModalContent, FullImage } from "./styled";
import { useEffect } from "react";

interface ImageModalProps {
  src: string;
  alt?: string;
  onClose: () => void;
}

export const ImageModal = ({ src, alt, onClose }: ImageModalProps) => {
  const { t } = useTranslation();
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent>
        <FullImage src={src} alt={alt || "full screen preview"} />
      </ModalContent>
    </ModalOverlay>
  );
};

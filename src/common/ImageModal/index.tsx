import { useEffect } from "react";
import { ModalOverlay, ModalContent, FullImage } from "./styled";
import { useScrollLock } from "../../hooks";

interface ImageModalProps {
  src: string;
  alt?: string;
  onClose: () => void;
}

export const ImageModal = ({ src, alt, onClose }: ImageModalProps) => {
  useScrollLock(true);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
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

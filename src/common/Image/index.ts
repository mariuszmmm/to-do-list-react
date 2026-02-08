import styled from "styled-components";
import { ReactComponent as Placeholder } from "../../images/imagePlaceholder.svg";

export const Image = styled.img`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

interface ImagePlaceholderProps {
  $imageSrc?: string;
}

export const ImagePlaceholder = styled(Placeholder)<ImagePlaceholderProps>`
  position: ${({ $imageSrc }) => ($imageSrc ? "absolute" : "static")};
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: ${({ $imageSrc }) => ($imageSrc ? 0 : 1)};
`;

export const ImagePreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 12px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.backgroundPrimary};
  position: relative;
  aspect-ratio: 1;

  img {
    width: 100%;
    border-radius: 4px;
    animation: fadeIn 0.3s ease-in;
  }

  svg {
    animation: fadeIn 0.3s ease-in;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background-color: #e0e0e0;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  margin-top: 0;
  overflow: hidden;
  position: absolute;
  bottom: 0;
`;

interface ProgressBarFillProps {
  $width: number;
  $isDownloading?: boolean;
}

export const ProgressBarFill = styled.div<ProgressBarFillProps>`
  height: 100%;
  background-color: ${({ $isDownloading }) => ($isDownloading ? "#150ed7" : "#4CAF50")};
  width: ${({ $width }) => $width}%;
  transition: width 0.1s ease;
`;

export const ImageInput = styled.input`
  display: none;
`;

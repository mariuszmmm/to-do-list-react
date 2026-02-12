import styled from "styled-components";

export const CameraModalOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 1);
  z-index: 1000;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 16px;
`;

export const CameraContainer = styled.div`
  position: relative;
  width: 90%;
  max-width: 600px;
  max-height: 70vh;
  aspect-ratio: 4 / 3;
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (orientation: landscape) {
    max-height: 60vh;
    max-width: 80vw;
  }
`;

export const CameraVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
`;

export const CameraModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  width: 90%;
  max-width: 600px;
`;

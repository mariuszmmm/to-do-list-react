import React from "react";
import { MessageContainer } from "../../../../../common/MessageContainer";
import { Info } from "../../../../../common/Info";

interface BackupStatusMessageProps {
  message: string;
  messageType: "success" | "error" | "info";
}

export const BackupStatusMessage: React.FC<BackupStatusMessageProps> = ({ message, messageType }) => (
  <MessageContainer>
    {!!message && (
      <Info $warning={messageType === "error"}>
        {message}
      </Info>
    )}
  </MessageContainer>
);

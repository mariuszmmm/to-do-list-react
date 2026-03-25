import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { consoleLogger } from "../../../utils/debug/consoleLogger";
import { useTranslation } from "react-i18next";

const ConsoleWrapper = styled.div`
  background: #1e1e1e;
  color: #d4d4d4;
  font-family: "Cascadia Code", "Consolas", "Monaco", monospace;
  font-size: 11px;
  padding: 10px;
  border-radius: 8px;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #333;
  margin-top: 10px;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.5);

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 4px;
  }
`;

const LogLine = styled.div<{ $type: string }>`
  margin-bottom: 4px;
  border-bottom: 1px solid #2a2a2a;
  padding-bottom: 2px;
  white-space: pre-wrap;
  word-break: break-all;
  color: ${({ $type }) => {
    switch ($type) {
      case "error":
        return "#f44336";
      case "warn":
        return "#ff9800";
      case "info":
        return "#2196f3";
      default:
        return "#d4d4d4";
    }
  }};

  span.time {
    color: #888;
    margin-right: 8px;
    font-size: 9px;
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`;

const ActionButton = styled.button`
  background: #333;
  color: #fff;
  border: 1px solid #444;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  transition: background 0.2s;

  &:hover {
    background: #444;
  }
`;

const ToggleContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.info};
  user-select: none;

  input {
    cursor: pointer;
  }
`;

interface SystemConsoleProps {
  preserveLogs: boolean;
  onTogglePreserveLogs: () => void;
}

export const SystemConsole = ({
  preserveLogs,
  onTogglePreserveLogs,
}: SystemConsoleProps) => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState(consoleLogger.getLogs());
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = consoleLogger.subscribe((newLogs) => {
      setLogs([...newLogs]);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (consoleEndRef.current && logs.length > 0) {
      // Opcjonalne: auto-scroll do dołu przy nowych wpisach
    }
  }, [logs]);

  const handleClear = () => {
    consoleLogger.clear();
  };

  return (
    <div>
      <Controls>
        <ToggleContainer>
          <input
            type="checkbox"
            checked={preserveLogs}
            onChange={onTogglePreserveLogs}
          />
          {t("accountPage.systemConsole.preserveLogs")}
        </ToggleContainer>
        <ActionButton onClick={handleClear}>
          {t("accountPage.systemConsole.clear")}
        </ActionButton>
      </Controls>
      <ConsoleWrapper>
        {logs.length === 0 ? (
          <div style={{ color: "#666", textAlign: "center", padding: "20px" }}>
            {t("accountPage.systemAdmin.logs.noLogs")}
          </div>
        ) : (
          logs.map((log, index) => (
            <LogLine key={index} $type={log.type}>
              <span className="time">[{log.timestamp}]</span>
              {log.message}
            </LogLine>
          ))
        )}
        <div ref={consoleEndRef} />
      </ConsoleWrapper>
    </div>
  );
};

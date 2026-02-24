import { useState, useEffect } from "react";
import {
  getSystemStatusApi,
  runCleanupApi,
  diagnoseSystemApi,
  runDeletedTasksCleanupApi,
  runLogsCleanupApi,
} from "../../../api/backupApi";
import { NameContainer } from "../../tasks/TasksPage/EditableListName/styled";
import { getUserToken } from "../../../utils/auth/getUserToken";
import {
  getAblyInstance,
  safeDetachChannel,
  isAblyErrorSilent,
} from "../../../utils/sync/ably";

import { NetlifySection } from "./components/NetlifySection";
import { AblySection } from "./components/AblySection";
import { DatabaseSection } from "./components/DatabaseSection";
import { StorageSection } from "./components/StorageSection";
import { DiagnosisSection } from "./components/DiagnosisSection";
import { LogsSection } from "./components/LogsSection";

export const SystemAdmin = () => {
  const [isCleaning, setIsCleaning] = useState(false);
  const [isCleaningTasks, setIsCleaningTasks] = useState(false);
  const [isCleaningLogs, setIsCleaningLogs] = useState(false);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [cleanupResults, setCleanupResults] = useState<any>(null);
  const [tasksCleanupResults, setTasksCleanupResults] = useState<any>(null);
  const [logsCleanupResults, setLogsCleanupResults] = useState<any>(null);
  const [cleanupMessage, setCleanupMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);
  const [tasksCleanupMessage, setTasksCleanupMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);
  const [logsCleanupMessage, setLogsCleanupMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);
  const [diagnosisMessage, setDiagnosisMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [cleanupStatus, setCleanupStatus] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [storageStats, setStorageStats] = useState<any>(null);
  const [netlifyStats, setNetlifyStats] = useState<any>(null);
  const [ablyStats, setAblyStats] = useState<any>(null);
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [ablyStatus, setAblyStatus] = useState<string>("connecting");

  const fetchData = async () => {
    const token = await getUserToken();
    if (token) {
      const response = await getSystemStatusApi(token);
      if (response.success && response.data) {
        setStats(response.data.stats);
        setCleanupStatus(response.data.cleanupStatus);
        setLogs(response.data.logs || []);
        setStorageStats(response.data.storageStats);
        setNetlifyStats(response.data.netlifyStats);
        setAblyStats(response.data.ablyStats);
      }
    }
  };

  useEffect(() => {
    fetchData();

    // Subscribe to real-time logs via Ably
    const ably = getAblyInstance();

    // Track connection status
    setAblyStatus(ably.connection.state);

    const onStateChange = (stateChange: any) => {
      setAblyStatus(stateChange.current);
    };
    ably.connection.on(onStateChange);

    const channel = ably.channels.get("system:logs");

    const onNewLog = (message: any) => {
      const newLog = message.data;
      setLogs((prevLogs) => {
        // Prevent duplicate logs if they arrive very quickly during fetchData
        const isDuplicate = prevLogs.some(
          (log) => log.key === newLog.key && log.timestamp === newLog.timestamp,
        );
        if (isDuplicate) return prevLogs;

        return [newLog, ...prevLogs].slice(0, 5); // Show only the last 5 logs
      });

      // Also update the specific statuses if they were updated
      if (newLog.key === "log_cleanup") setCleanupStatus(newLog);
    };

    channel.subscribe("new-log", onNewLog).catch((err) => {
      if (isAblyErrorSilent(err)) return;
      console.warn("[SystemAdmin] channel subscribe error:", err);
    });

    return () => {
      ably.connection.off(onStateChange);
      channel.unsubscribe("new-log", onNewLog);
      // Suppress potential unhandled rejections during unmount
      safeDetachChannel(channel).catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRunCleanup = async () => {
    setIsCleaning(true);
    setCleanupMessage(null);
    setCleanupResults(null);
    const token = await getUserToken();
    if (token) {
      const response = await runCleanupApi(token);
      if (response.success) {
        setCleanupResults(response.data);
        await fetchData();
      } else {
        setCleanupMessage({ text: response.message, isError: true });
      }
    }
    setIsCleaning(false);
  };

  const handleRunDiagnosis = async () => {
    setIsDiagnosing(true);
    setDiagnosisMessage(null);
    setDiagnosis(null);
    const token = await getUserToken();
    if (token) {
      const response = await diagnoseSystemApi(token);
      if (response.success) {
        setDiagnosis(response.data);
      } else {
        setDiagnosisMessage({ text: response.message, isError: true });
      }
    }
    setIsDiagnosing(false);
  };

  const handleRunTasksCleanup = async () => {
    setIsCleaningTasks(true);
    setTasksCleanupMessage(null);
    setTasksCleanupResults(null);
    setLogsCleanupResults(null);
    const token = await getUserToken();
    if (token) {
      const response = await runDeletedTasksCleanupApi(token);
      if (response.success) {
        setTasksCleanupResults(response.data);
        await fetchData();
      } else {
        setTasksCleanupMessage({ text: response.message, isError: true });
      }
    }
    setIsCleaningTasks(false);
  };

  const handleRunLogsCleanup = async () => {
    setIsCleaningLogs(true);
    setLogsCleanupMessage(null);
    setLogsCleanupResults(null);
    setTasksCleanupResults(null);
    const token = await getUserToken();
    if (token) {
      const response = await runLogsCleanupApi(token);
      if (response.success) {
        setLogsCleanupResults(response.data);
        await fetchData();
      } else {
        setLogsCleanupMessage({ text: response.message, isError: true });
      }
    }
    setIsCleaningLogs(false);
  };

  return (
    <NameContainer $account>
      {/* 1. Hosting i Platforma (Netlify) */}
      <NetlifySection netlifyStats={netlifyStats} />

      {/* 2. Infrastruktura Danych i Użytkownicy (Database) */}
      <DatabaseSection
        stats={stats}
        loading={isCleaningTasks}
        loadingLogs={isCleaningLogs}
        message={tasksCleanupMessage}
        logsMessage={logsCleanupMessage}
        results={tasksCleanupResults}
        logsResults={logsCleanupResults}
        onRunCleanup={handleRunTasksCleanup}
        onRunLogsCleanup={handleRunLogsCleanup}
      />

      {/* 3. Storage */}
      <StorageSection
        storageStats={storageStats}
        cleanupStatus={cleanupStatus}
        loading={isCleaning}
        message={cleanupMessage}
        results={cleanupResults}
        onRunCleanup={handleRunCleanup}
      />

      {/* 4. Komunikacja i Synchronizacja (Ably) */}
      <AblySection ablyStatus={ablyStatus} ablyStats={ablyStats} />

      {/* 5. Diagnosis */}
      <DiagnosisSection
        diagnosis={diagnosis}
        loading={isDiagnosing}
        message={diagnosisMessage}
        onRunDiagnosis={handleRunDiagnosis}
      />

      {/* 6. Logs */}
      <LogsSection logs={logs} />
    </NameContainer>
  );
};

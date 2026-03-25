type LogEntry = {
  type: "log" | "error" | "warn" | "info";
  message: string;
  timestamp: string;
};

type Listener = (logs: LogEntry[]) => void;

class ConsoleLogger {
  private logs: LogEntry[] = [];
  private listeners: Listener[] = [];
  private maxLogs = 100;
  private storageKey = "system_console_logs";
  private settingsKey = "settings";

  constructor() {
    this.loadPersistentLogs();
    this.setupInterceptors();
  }

  private isPreserveLogsEnabled(): boolean {
    try {
      const settings = JSON.parse(localStorage.getItem(this.settingsKey) || "{}");
      return !!settings.preserveLogs;
    } catch (e) {
      return false;
    }
  }

  private loadPersistentLogs() {
    if (this.isPreserveLogsEnabled()) {
      try {
        const savedLogs = sessionStorage.getItem(this.storageKey);
        if (savedLogs) {
          this.logs = JSON.parse(savedLogs);
        }
      } catch (e) {
        console.error("Failed to load persistent logs", e);
      }
    }
  }

  private savePersistentLogs() {
    if (this.isPreserveLogsEnabled()) {
      try {
        sessionStorage.setItem(this.storageKey, JSON.stringify(this.logs));
      } catch (e) {
        // Silently fail if storage full
      }
    } else {
      sessionStorage.removeItem(this.storageKey);
    }
  }

  private setupInterceptors() {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    console.log = (...args: any[]) => {
      this.addLog("log", args);
      originalLog.apply(console, args);
    };

    console.error = (...args: any[]) => {
      this.addLog("error", args);
      originalError.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      this.addLog("warn", args);
      originalWarn.apply(console, args);
    };

    console.info = (...args: any[]) => {
      this.addLog("info", args);
      originalInfo.apply(console, args);
    };
  }

  private addLog(type: LogEntry["type"], args: any[]) {
    // Avoid double logging our own log interceptor errors if any
    const message = args
      .map((arg) => {
        if (typeof arg === "object") {
          try {
            return JSON.stringify(arg, null, 2);
          } catch (e) {
            return "[Circular Object]";
          }
        }
        return String(arg);
      })
      .join(" ");

    const entry: LogEntry = {
      type,
      message,
      timestamp: new Date().toLocaleTimeString(),
    };

    this.logs = [entry, ...this.logs].slice(0, this.maxLogs);
    this.savePersistentLogs();
    this.notify();
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.logs));
  }

  public subscribe(listener: Listener) {
    this.listeners.push(listener);
    listener(this.logs);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getLogs() {
    return this.logs;
  }

  public clear() {
    this.logs = [];
    sessionStorage.removeItem(this.storageKey);
    this.notify();
  }

  // Called when toggle preserveLogs in UI
  public setPreserveLogs(enabled: boolean) {
    if (!enabled) {
      sessionStorage.removeItem(this.storageKey);
    } else {
       this.savePersistentLogs();
    }
  }
}

export const consoleLogger = new ConsoleLogger();

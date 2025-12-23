import React, { createContext, useContext, useEffect, useState } from "react";

interface TimeContextValue {
  now: Date;
}

const TimeContext = createContext<TimeContextValue | undefined>(undefined);

export const TimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TimeContext.Provider value={{ now }}>
      {children}
    </TimeContext.Provider>
  );
};

export const useTime = (): TimeContextValue => {
  const context = useContext(TimeContext);
  if (!context) {
    throw new Error("useTime must be used within a TimeProvider");
  }
  return context;
};

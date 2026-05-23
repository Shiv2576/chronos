import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";
import {
  TimerSession,
  TimerMode,
  getTodayTimeSpent,
  formatTimeSpent,
} from "@/types";

interface TimerContextType {
  sessions: TimerSession[];
  todayTime: { hours: number; minutes: number };
  formattedTodayTime: string;
  startSession: (mode: TimerMode) => void;
  endSession: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sessions, setSessions] = useState<TimerSession[]>([]);
  const sessionStartRef = useRef<number>(0);
  const currentModeRef = useRef<TimerMode>("pomodoro");

  const startSession = useCallback((mode: TimerMode) => {
    sessionStartRef.current = Date.now();
    currentModeRef.current = mode;
  }, []);

  const endSession = useCallback(() => {
    if (sessionStartRef.current > 0) {
      const duration = Math.floor(
        (Date.now() - sessionStartRef.current) / 1000,
      );

      if (duration > 0) {
        const session: TimerSession = {
          startTime: sessionStartRef.current,
          date: new Date().toISOString().split("T")[0],
          duration,
          mode: currentModeRef.current,
        };

        setSessions((prev) => [...prev, session]);
      }

      sessionStartRef.current = 0;
    }
  }, []);

  const todayTime = getTodayTimeSpent(sessions);
  const formattedTodayTime = formatTimeSpent(
    todayTime.hours,
    todayTime.minutes,
  );

  return (
    <TimerContext.Provider
      value={{
        sessions,
        todayTime,
        formattedTodayTime,
        startSession,
        endSession,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within TimerProvider");
  }
  return context;
};

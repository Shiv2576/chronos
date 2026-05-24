// components/context/timerContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import {
  TimerSession,
  TimerMode,
  getTodayTimeSpent,
  formatTimeSpent,
} from "@/types";
import { useUser } from "@clerk/expo";

interface TimerContextType {
  sessions: TimerSession[];
  todayTime: { hours: number; minutes: number };
  formattedTodayTime: string;
  startSession: (mode: TimerMode) => void;
  endSession: () => void;
  isLoading: boolean;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoaded } = useUser();
  const [sessions, setSessions] = useState<TimerSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sessionStartRef = useRef<number>(0);
  const currentModeRef = useRef<TimerMode>("pomodoro");

  const loadSessions = useCallback(() => {
    try {
      const savedSessions = user?.unsafeMetadata?.timerSessions;
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions as string);
        // Only keep sessions from last 7 days to prevent data bloat
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentSessions = parsed.filter((session: TimerSession) => {
          return new Date(session.date) >= sevenDaysAgo;
        });
        setSessions(recentSessions);
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const saveSessions = useCallback(
    async (updatedSessions: TimerSession[]) => {
      if (!user) return;

      try {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            timerSessions: JSON.stringify(updatedSessions),
          },
        });
      } catch (error) {
        console.error("Error saving sessions:", error);
      }
    },
    [user],
  );

  useEffect(() => {
    if (isLoaded && user) {
      loadSessions();
    } else if (isLoaded && !user) {
      setSessions([]);
      setIsLoading(false);
    }
  }, [isLoaded, user, loadSessions]);

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

        setSessions((prev) => {
          const updated = [...prev, session];
          // Save to Clerk
          saveSessions(updated);
          return updated;
        });
      }

      sessionStartRef.current = 0;
    }
  }, [saveSessions]);

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
        isLoading,
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

// components/context/settingsContext.tsx

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  TimerConfig,
  AlarmSettings,
  DEFAULT_TIMER_CONFIG,
  DEFAULT_ALARM_SETTINGS,
} from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SettingsContextType {
  timerConfig: TimerConfig;
  alarmSettings: AlarmSettings;
  updateTimerConfig: (config: Partial<TimerConfig>) => void;
  updateAlarmSettings: (settings: Partial<AlarmSettings>) => void;
  resetToDefaults: () => void;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

const STORAGE_KEYS = {
  TIMER_CONFIG: "@timer_config",
  ALARM_SETTINGS: "@alarm_settings",
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [timerConfig, setTimerConfig] =
    useState<TimerConfig>(DEFAULT_TIMER_CONFIG);
  const [alarmSettings, setAlarmSettings] = useState<AlarmSettings>(
    DEFAULT_ALARM_SETTINGS,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [timerConfigStr, alarmSettingsStr] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TIMER_CONFIG),
        AsyncStorage.getItem(STORAGE_KEYS.ALARM_SETTINGS),
      ]);

      if (timerConfigStr) {
        setTimerConfig(JSON.parse(timerConfigStr));
      }
      if (alarmSettingsStr) {
        setAlarmSettings(JSON.parse(alarmSettingsStr));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (
    newTimerConfig: TimerConfig,
    newAlarmSettings: AlarmSettings,
  ) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(
          STORAGE_KEYS.TIMER_CONFIG,
          JSON.stringify(newTimerConfig),
        ),
        AsyncStorage.setItem(
          STORAGE_KEYS.ALARM_SETTINGS,
          JSON.stringify(newAlarmSettings),
        ),
      ]);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const updateTimerConfig = (config: Partial<TimerConfig>) => {
    setTimerConfig((prev) => {
      const updated = { ...prev, ...config };
      saveSettings(updated, alarmSettings);
      return updated;
    });
  };

  const updateAlarmSettings = (settings: Partial<AlarmSettings>) => {
    setAlarmSettings((prev) => {
      const updated = { ...prev, ...settings };
      saveSettings(timerConfig, updated);
      return updated;
    });
  };

  const resetToDefaults = () => {
    setTimerConfig(DEFAULT_TIMER_CONFIG);
    setAlarmSettings(DEFAULT_ALARM_SETTINGS);
    saveSettings(DEFAULT_TIMER_CONFIG, DEFAULT_ALARM_SETTINGS);
  };

  return (
    <SettingsContext.Provider
      value={{
        timerConfig,
        alarmSettings,
        updateTimerConfig,
        updateAlarmSettings,
        resetToDefaults,
        isLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
};

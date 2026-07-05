// hooks/useStreak.ts
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface StreakData {
  currentWeekStreak: number;
  weekStartDate: string;
  weekEndDate: string;
  weekNumber: number;
  year: number;
  lastActiveDate: string | null;
  totalActiveDaysThisWeek: number;
  daysActiveThisWeek: string[];
}

export function useStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentWeekStreak: 0,
    weekStartDate: "",
    weekEndDate: "",
    weekNumber: 0,
    year: 0,
    lastActiveDate: null,
    totalActiveDaysThisWeek: 0,
    daysActiveThisWeek: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updateStreak();
  }, []);

  const getWeekStart = (date: Date): Date => {
    const day = date.getDay();
    const dayOfWeek = day === 0 ? 7 : day;
    const diff = dayOfWeek - 1;
    const monday = new Date(date);
    monday.setDate(date.getDate() - diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const getWeekEnd = (startDate: Date): Date => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
    return endDate;
  };

  const isDateInCurrentWeek = (
    date: Date,
    weekStart: Date,
    weekEnd: Date,
  ): boolean => {
    return date >= weekStart && date <= weekEnd;
  };

  const getDeviceId = async (): Promise<string> => {
    try {
      let deviceId = await AsyncStorage.getItem("@device_id");
      if (!deviceId) {
        deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        await AsyncStorage.setItem("@device_id", deviceId);
        console.log("Created new device ID:", deviceId);
      } else {
        console.log("Existing device ID found:", deviceId);
      }
      return deviceId;
    } catch (error) {
      return `device_${Date.now()}`;
    }
  };

  const updateStreak = async () => {
    try {
      const deviceId = await getDeviceId();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split("T")[0];

      // Get current week info
      const weekStart = getWeekStart(new Date(today));
      const weekEnd = getWeekEnd(new Date(weekStart));
      const weekStartStr = weekStart.toISOString().split("T")[0];
      const weekEndStr = weekEnd.toISOString().split("T")[0];

      const storageKey = `weekly_streak_${deviceId}`;

      const storedData = await AsyncStorage.getItem(storageKey);
      let weeklyData = storedData ? JSON.parse(storedData) : {};

      // Get the week key based on Monday date
      const weekKey = weekStartStr;

      // CRITICAL: Check if we need to reset for new week
      let currentWeek = weeklyData[weekKey];
      const lastActiveDate = weeklyData.lastActiveDate;

      // If last active date exists and is from previous week, reset the week
      if (lastActiveDate) {
        const lastActive = new Date(lastActiveDate);
        lastActive.setHours(0, 0, 0, 0);

        // If last active was before this week's Monday, start fresh
        if (lastActive < weekStart) {
          console.log("New week detected! Resetting streak data");
          currentWeek = null;
        }
      }

      // Initialize current week if not exists
      if (!currentWeek) {
        currentWeek = {
          weekStart: weekStartStr,
          weekEnd: weekEndStr,
          activeDays: [],
        };
        weeklyData[weekKey] = currentWeek;
        console.log(
          `Initialized new week ${weekKey} (${weekStartStr} to ${weekEndStr})`,
        );
      }

      // Filter active days to only include dates in current week
      const validActiveDays = currentWeek.activeDays.filter((date: string) => {
        const activeDate = new Date(date);
        activeDate.setHours(0, 0, 0, 0);
        return activeDate >= weekStart && activeDate <= weekEnd;
      });

      currentWeek.activeDays = validActiveDays;

      // Add today if not already active and today is within current week
      const alreadyActiveToday = currentWeek.activeDays.includes(todayStr);
      const isTodayInWeek = isDateInCurrentWeek(today, weekStart, weekEnd);

      if (!alreadyActiveToday && isTodayInWeek) {
        currentWeek.activeDays.push(todayStr);
        console.log(`Added today (${todayStr}) to week ${weekKey}`);
      }

      // Sort active days chronologically
      currentWeek.activeDays.sort();

      // Calculate current week streak (days active this week)
      const currentWeekStreak = currentWeek.activeDays.length;

      // Save updated data
      weeklyData[weekKey] = currentWeek;
      weeklyData.lastActiveDate = todayStr;
      await AsyncStorage.setItem(storageKey, JSON.stringify(weeklyData));

      // Clean up old weeks (keep only current and last 3 weeks)
      const weeks = Object.keys(weeklyData).filter(
        (key) => key !== "lastActiveDate",
      );
      if (weeks.length > 4) {
        const sortedWeeks = weeks.sort();
        const weeksToDelete = sortedWeeks.slice(0, weeks.length - 4);
        weeksToDelete.forEach((week) => {
          delete weeklyData[week];
        });
        await AsyncStorage.setItem(storageKey, JSON.stringify(weeklyData));
      }

      const newStreakData = {
        currentWeekStreak,
        weekStartDate: weekStartStr,
        weekEndDate: weekEndStr,
        weekNumber: 0, // Optional, can be calculated if needed
        year: today.getFullYear(),
        lastActiveDate: todayStr,
        totalActiveDaysThisWeek: currentWeekStreak,
        daysActiveThisWeek: currentWeek.activeDays,
      };

      setStreakData(newStreakData);
      console.log("Updated weekly streak data:", newStreakData);
    } catch (error) {
      console.error("Error updating streak:", error);
    } finally {
      setLoading(false);
    }
  };

  // Manual reset for testing
  const resetCurrentWeek = async () => {
    try {
      const deviceId = await getDeviceId();
      const today = new Date();
      const weekStart = getWeekStart(today);
      const weekKey = weekStart.toISOString().split("T")[0];
      const storageKey = `weekly_streak_${deviceId}`;

      const storedData = await AsyncStorage.getItem(storageKey);
      let weeklyData = storedData ? JSON.parse(storedData) : {};

      if (weeklyData[weekKey]) {
        delete weeklyData[weekKey];
        await AsyncStorage.setItem(storageKey, JSON.stringify(weeklyData));
        console.log("Reset current week");
        await updateStreak(); // Refresh data
      }
    } catch (error) {
      console.error("Error resetting week:", error);
    }
  };

  return { streakData, loading, updateStreak, resetCurrentWeek };
}

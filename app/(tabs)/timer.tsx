// app/(tabs)/timer.tsx

import { TimerMode, formatTime, getTimeForMode } from "@/types";
import { useState, useEffect, useRef } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { ThemedText } from "@/components/themed-text";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react-native";
import { useTimer } from "@/components/context/timerContext";
import { useSettings } from "@/components/context/timer-settings";
import { StreakCard } from "@/components/streaks_card";
import { useStreak } from "@/hooks/use_streaks";

function TimerScreen() {
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | number>(null);

  const { startSession, endSession } = useTimer();
  const { timerConfig } = useSettings();
  const { streakData, loading } = useStreak();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  useEffect(() => {
    setTimeLeft(getTimeForMode(mode, timerConfig));
    setIsRunning(false);
  }, [mode, timerConfig]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      endSession();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, endSession]);

  const handleStart = () => {
    startSession(mode);
    setIsRunning(true);
  };

  const handlePause = () => {
    endSession();
    setIsRunning(false);
  };

  const handleReset = () => {
    if (isRunning) {
      endSession();
    }
    setIsRunning(false);
    setTimeLeft(getTimeForMode(mode, timerConfig));
  };

  const handleNext = () => {
    if (isRunning) {
      endSession();
    }
    setIsRunning(false);
    switch (mode) {
      case "pomodoro":
        setMode("shortBreak");
        break;
      case "shortBreak":
        setMode("longBreak");
        break;
      case "longBreak":
        setMode("pomodoro");
        break;
    }
  };

  const handleModeChange = (newMode: TimerMode) => {
    if (isRunning) {
      endSession();
      setIsRunning(false);
    }
    setMode(newMode);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.contentContainer,
        {
          paddingBottom: tabBarHeight + insets.bottom + 20,
        },
      ]}
    >
      <View style={styles.modeSelector}>
        <Pressable
          style={[
            styles.modeButton,
            mode === "pomodoro" && styles.modeButtonActive,
          ]}
          onPress={() => handleModeChange("pomodoro")}
        >
          <ThemedText
            style={[
              styles.modeText,
              mode === "pomodoro" && styles.modeTextActive,
            ]}
          >
            Pomodoro
          </ThemedText>
        </Pressable>

        <Pressable
          style={[
            styles.modeButton,
            mode === "shortBreak" && styles.modeButtonActive,
          ]}
          onPress={() => handleModeChange("shortBreak")}
        >
          <ThemedText
            style={[
              styles.modeText,
              mode === "shortBreak" && styles.modeTextActive,
            ]}
          >
            Short Break
          </ThemedText>
        </Pressable>

        <Pressable
          style={[
            styles.modeButton,
            mode === "longBreak" && styles.modeButtonActive,
          ]}
          onPress={() => handleModeChange("longBreak")}
        >
          <ThemedText
            style={[
              styles.modeText,
              mode === "longBreak" && styles.modeTextActive,
            ]}
          >
            Long Break
          </ThemedText>
        </Pressable>
      </View>

      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <ThemedText style={styles.timerText}>{formatTime(timeLeft)}</ThemedText>
      </View>

      {/* Timer Controls */}
      <View style={styles.controls}>
        <Pressable
          style={[styles.controlButton, styles.sideButton]}
          onPress={handleReset}
        >
          <RotateCcw size={28} color="#fff" />
        </Pressable>

        {!isRunning ? (
          <Pressable
            style={[styles.controlButton, styles.centerButton]}
            onPress={handleStart}
          >
            <Play size={36} color="#fff" />
          </Pressable>
        ) : (
          <Pressable
            style={[styles.controlButton, styles.centerButton]}
            onPress={handlePause}
          >
            <Pause size={36} color="#fff" />
          </Pressable>
        )}

        <Pressable
          style={[styles.controlButton, styles.sideButton]}
          onPress={handleNext}
        >
          <SkipForward size={28} color="#fff" />
        </Pressable>
      </View>

      <StreakCard
        currentWeekStreak={streakData.currentWeekStreak}
        weekStartDate={streakData.weekStartDate}
        weekEndDate={streakData.weekEndDate}
        daysActiveThisWeek={streakData.daysActiveThisWeek}
      />

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F5F5F3",
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F3",
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  modeSelector: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 4,
    marginBottom: 48,
    gap: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  modeButtonActive: {
    backgroundColor: "#9A433B",
  },
  modeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  modeTextActive: {
    color: "#fff",
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  timerText: {
    fontSize: 130,
    fontWeight: "900",
    fontFamily: Platform.select({
      ios: "SF Pro Display",
      android: "Roboto",
    }),
    color: "#9A433B",
    lineHeight: 110,
  },
  controls: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  controlButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  sideButton: {
    backgroundColor: "#767776",
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  centerButton: {
    backgroundColor: "#9A433B",
    width: 150,
    height: 80,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#9A433B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 5.3,
    shadowRadius: 10,
    elevation: 5,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default TimerScreen;

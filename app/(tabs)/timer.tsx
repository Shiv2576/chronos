// app/(tabs)/timer.tsx

import { Pressable, View, StyleSheet, Platform, Text } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useState } from "react";

function TimerScreen() {
  const [minutes, setMinutes] = useState("25");
  const [seconds, setSeconds] = useState("00");
  const [isRunning, setIsRunning] = useState(false);

  return (
    <View style={styles.container}>
      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <View style={styles.timerCard}>
          <ThemedText style={styles.timerText}>
            {minutes}:{seconds}
          </ThemedText>

          {/* Timer Controls */}
          <View style={styles.timerControls}>
            <Pressable
              style={styles.controlButton}
              onPress={() => setIsRunning(!isRunning)}
            >
              <Text style={styles.controlButtonText}>
                {isRunning ? "Pause" : "Start"}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.controlButton, styles.resetButton]}
              onPress={() => {
                setMinutes("25");
                setSeconds("00");
                setIsRunning(false);
              }}
            >
              <Text style={styles.controlButtonText}>Reset</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Session Info */}
      <View style={styles.sessionInfo}>
        <ThemedText style={styles.sessionLabel}>Current Session</ThemedText>
        <ThemedText style={styles.sessionType}>Focus Time</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F3",
    padding: 24,
  },

  header: {
    alignItems: "center",
    marginBottom: 40,
  },

  chronosTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: Platform.select({
      ios: "SF Pro Text",
      android: "Roboto",
    }),
    color: "#9A433B",
    letterSpacing: 2,
    marginBottom: 20,
  },

  pageTitle: {
    fontSize: 40,
    fontWeight: "300",
    fontFamily: Platform.select({
      ios: "SF Pro Display",
      android: "Roboto",
    }),
    color: "#000000",
    textAlign: "center",
  },

  timerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  timerCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 40,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  timerText: {
    fontSize: 72,
    fontWeight: "300",
    fontFamily: Platform.select({
      ios: "SF Pro Display",
      android: "Roboto",
    }),
    color: "#9A433B",
    marginBottom: 30,
  },

  timerControls: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },

  controlButton: {
    flex: 1,
    backgroundColor: "#9A433B",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  resetButton: {
    backgroundColor: "#666",
  },

  controlButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Platform.select({
      ios: "SF Pro Text",
      android: "Roboto",
    }),
  },

  sessionInfo: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },

  sessionLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },

  sessionType: {
    fontSize: 18,
    fontWeight: "600",
    color: "#9A433B",
  },

  logoutButton: {
    backgroundColor: "#E67E73",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
  },

  logoutButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default TimerScreen;

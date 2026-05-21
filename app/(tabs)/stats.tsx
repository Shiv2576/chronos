// app/(tabs)/stats.tsx

import { View, StyleSheet, Platform } from "react-native";
import { ThemedText } from "@/components/themed-text";

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Statistics</ThemedText>

      <View style={styles.statsCard}>
        <ThemedText style={styles.statValue}>24</ThemedText>
        <ThemedText style={styles.statLabel}>Total Sessions</ThemedText>
      </View>

      <View style={styles.statsCard}>
        <ThemedText style={styles.statValue}>12h 30m</ThemedText>
        <ThemedText style={styles.statLabel}>Total Focus Time</ThemedText>
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
  title: {
    fontSize: 32,
    fontWeight: "300",
    fontFamily: Platform.select({
      ios: "SF Pro Display",
      android: "Roboto",
    }),
    color: "#000",
    marginBottom: 24,
    textAlign: "center",
  },
  statsCard: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  statValue: {
    fontSize: 48,
    fontWeight: "700",
    color: "#9A433B",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 16,
    color: "#666",
  },
});

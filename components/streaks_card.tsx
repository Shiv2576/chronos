// components/StreakCard.tsx
import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Calendar, Flame, Check, Circle } from "lucide-react-native";

interface StreakCardProps {
  currentWeekStreak: number;
  weekStartDate: string;
  weekEndDate: string;
  daysActiveThisWeek: string[];
}

export function StreakCard({
  currentWeekStreak,
  weekStartDate,
  weekEndDate,
  daysActiveThisWeek,
}: StreakCardProps) {
  const progress = (currentWeekStreak / 7) * 100;
  const daysRemaining = 7 - currentWeekStreak;
  const isComplete = currentWeekStreak >= 7;

  // Format dates for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Check if a specific date is active
  const isDateActive = (dateStr: string) => {
    return daysActiveThisWeek.includes(dateStr);
  };

  // Generate dates for current week (Monday to Sunday)
  const getWeekDates = () => {
    const startDate = new Date(weekStartDate);
    const dates = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }

    return dates;
  };

  const weekDates = getWeekDates();
  const today = new Date().toISOString().split("T")[0];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Calendar size={20} color="#9A433B" />
        </View>
        <View style={styles.streakContainer}>
          <Flame size={18} color="#FF6B35" />
          <ThemedText style={styles.streakCount}>
            {currentWeekStreak}/7
          </ThemedText>
        </View>
      </View>

      <View style={styles.weekRange}>
        <ThemedText style={styles.weekRangeText}>
          {formatDate(weekStartDate)} - {formatDate(weekEndDate)}
        </ThemedText>
      </View>

      <View style={styles.daysContainer}>
        {weekDates.map((dateStr, index) => {
          const isActive = isDateActive(dateStr);
          const isToday = dateStr === today;

          return (
            <View
              key={index}
              style={[
                styles.dayIndicator,
                isActive && styles.dayActive,
                isToday && !isActive && styles.dayToday,
              ]}
            >
              {isActive ? (
                <Check size={16} color="#fff" />
              ) : isToday ? (
                <Circle size={12} color="#9A433B" fill="#9A433B" />
              ) : (
                <View style={styles.emptyDot} />
              )}
            </View>
          );
        })}
      </View>

      {isComplete && (
        <View style={styles.completeContainer}>
          <View style={styles.completeHeader}>
            <Flame size={20} color="#FF6B35" />
            <ThemedText style={styles.completeMessage}>
              Weekly Goal Achieved
            </ThemedText>
          </View>
          <ThemedText style={styles.completeSubMessage}>
            Active every day this week
          </ThemedText>
        </View>
      )}

      {/* Progress info */}
      <View style={styles.progressInfo}>
        <ThemedText style={styles.progressInfoText}>
          {currentWeekStreak} of 7 days active
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  streakCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#9A433B",
  },
  weekRange: {
    alignItems: "center",
    marginBottom: 16,
  },
  weekRangeText: {
    fontSize: 12,
    color: "#999",
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#9A433B",
    borderRadius: 4,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 8,
  },
  dayIndicator: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  dayActive: {
    backgroundColor: "#9A433B",
  },
  dayToday: {
    backgroundColor: "#FFF5F2",
    borderWidth: 1,
    borderColor: "#9A433B",
  },
  emptyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#DDD",
  },
  messageContainer: {
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  message: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },
  completeContainer: {
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 4,
  },
  completeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  completeMessage: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF6B35",
    textAlign: "center",
  },
  completeSubMessage: {
    fontSize: 11,
    color: "#999",
    textAlign: "center",
  },
  progressInfo: {
    marginTop: 12,
    alignItems: "center",
  },
  progressInfoText: {
    fontSize: 11,
    color: "#999",
  },
});

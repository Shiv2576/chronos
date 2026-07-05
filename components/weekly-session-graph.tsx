// components/weekly-stats-chart.tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { TimerSession } from "@/types";
import Svg, { Rect, Text as SvgText, G, Line } from "react-native-svg";

interface WeeklyStatsChartProps {
  sessions: TimerSession[];
}

interface DayData {
  day: string;
  dayName: string;
  totalSeconds: number;
  isToday: boolean;
}

export const WeeklyStatsChart: React.FC<WeeklyStatsChartProps> = ({
  sessions,
}) => {
  const [weekData, setWeekData] = useState<DayData[]>([]);
  const [maxValue, setMaxValue] = useState(0);

  useEffect(() => {
    const data = getLast7DaysData(sessions);
    setWeekData(data);
    const max = Math.max(...data.map((d) => d.totalSeconds), 1);
    setMaxValue(max);
  }, [sessions]);

  const getLast7DaysData = (sessions: TimerSession[]): DayData[] => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result: DayData[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const dayTotal = sessions
        .filter((session) => session.date === dateStr)
        .reduce((sum, session) => sum + session.duration, 0);

      result.push({
        day: dateStr,
        dayName: days[date.getDay()],
        totalSeconds: dayTotal,
        isToday: i === 0,
      });
    }
    return result;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return "0m";
  };

  const barWidth = 30;
  const chartHeight = 200;
  const chartWidth = Dimensions.get("window").width - 60;

  // Calculate the maximum value for y-axis scaling
  const getMaxValue = () => {
    if (maxValue === 0) return 1;
    // Round up to nearest 5 minutes (300 seconds) for cleaner axis
    const roundedUp = Math.ceil(maxValue / 300) * 300;
    return roundedUp;
  };

  const maxDisplayValue = getMaxValue();

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Weekly Overview</ThemedText>

      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight + 40}>
          {/* Y-axis grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = chartHeight - ratio * chartHeight;
            const value = Math.round(maxDisplayValue * ratio);
            return (
              <G key={index}>
                <Line
                  x1={35}
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke="#E0E0E0"
                  strokeWidth={0.5}
                  strokeDasharray="4"
                />
                <SvgText
                  x={30}
                  y={y + 4}
                  fontSize={10}
                  fill="#999"
                  textAnchor="end"
                >
                  {formatDuration(value)}
                </SvgText>
              </G>
            );
          })}

          {/* Bars */}
          {weekData.map((day, index) => {
            const barHeight =
              maxDisplayValue > 0
                ? (day.totalSeconds / maxDisplayValue) * chartHeight
                : 0;
            const x = 40 + (index * (chartWidth - 40)) / 7 + 5;
            const y = chartHeight - barHeight;

            return (
              <G key={index}>
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barHeight, 2)} // Minimum height for visibility
                  fill={day.isToday ? "#9A433B" : "#D4A09A"}
                  opacity={day.isToday ? 1 : 0.6}
                  rx={4}
                />
                {barHeight > 25 && day.totalSeconds > 0 && (
                  <SvgText
                    x={x + barWidth / 2}
                    y={y - 6}
                    fontSize={9}
                    fill="#333"
                    textAnchor="middle"
                  >
                    {formatDuration(day.totalSeconds)}
                  </SvgText>
                )}
                <SvgText
                  x={x + barWidth / 2}
                  y={chartHeight + 20}
                  fontSize={12}
                  fill={day.isToday ? "#9A433B" : "#666"}
                  textAnchor="middle"
                  fontWeight={day.isToday ? "bold" : "normal"}
                >
                  {day.dayName}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendToday]} />
          <ThemedText style={styles.legendText}>Today</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendOther]} />
          <ThemedText style={styles.legendText}>Other Days</ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendToday: {
    backgroundColor: "#9A433B",
  },
  legendOther: {
    backgroundColor: "#D4A09A",
  },
  legendText: {
    fontSize: 12,
    color: "#666",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#9A433B",
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
  },
  summaryDivider: {
    width: 1,
    backgroundColor: "#F0F0F0",
  },
});

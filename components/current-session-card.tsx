// components/current-session-card.tsx

import React, { useState, useEffect } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useTimer } from "@/components/context/timerContext";
import Svg, {
  Circle,
  Line,
  Defs,
  Pattern,
  Rect,
  LinearGradient,
  Stop,
  Path,
} from "react-native-svg";

export const CurrentSessionCard = () => {
  const { formattedTodayTime, todayTime } = useTimer();
  const { width: screenWidth } = useWindowDimensions();
  const [currentDate, setCurrentDate] = useState("");
  const cardWidth = screenWidth - 40;
  const cardHeight = 220; // Increased from 200 to 220

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);

  const SessionCardBackground = () => (
    <Svg
      width={cardWidth}
      height={cardHeight}
      viewBox={`0 0 ${cardWidth} ${cardHeight}`}
    >
      <Defs>
        <LinearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="50%" stopColor="#FDF8F7" />
          <Stop offset="100%" stopColor="#FDF5F3" />
        </LinearGradient>

        <Pattern
          id="dotPattern"
          x="0"
          y="0"
          width="30"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <Circle cx="15" cy="15" r="1.5" fill="#9A433B" opacity="0.12" />
        </Pattern>

        <Pattern
          id="linePattern"
          x="0"
          y="0"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <Line
            x1="0"
            y1="0"
            x2="60"
            y2="60"
            stroke="#9A433B"
            strokeWidth="0.8"
            opacity="0.06"
          />
          <Line
            x1="60"
            y1="0"
            x2="0"
            y2="60"
            stroke="#9A433B"
            strokeWidth="0.8"
            opacity="0.06"
          />
        </Pattern>

        <Pattern
          id="zigzagPattern"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <Line
            x1="0"
            y1="20"
            x2="10"
            y2="10"
            stroke="#9A433B"
            strokeWidth="0.5"
            opacity="0.08"
          />
          <Line
            x1="10"
            y1="10"
            x2="20"
            y2="20"
            stroke="#9A433B"
            strokeWidth="0.5"
            opacity="0.08"
          />
          <Line
            x1="20"
            y1="20"
            x2="30"
            y2="10"
            stroke="#9A433B"
            strokeWidth="0.5"
            opacity="0.08"
          />
          <Line
            x1="30"
            y1="10"
            x2="40"
            y2="20"
            stroke="#9A433B"
            strokeWidth="0.5"
            opacity="0.08"
          />
        </Pattern>
      </Defs>

      <Rect
        x="0"
        y="0"
        width={cardWidth}
        height={cardHeight}
        fill="url(#cardGradient)"
        rx="24"
      />

      <Rect
        x="0"
        y="0"
        width={cardWidth}
        height={cardHeight}
        fill="url(#dotPattern)"
        rx="24"
      />
      <Rect
        x="0"
        y="0"
        width={cardWidth}
        height={cardHeight}
        fill="url(#linePattern)"
        rx="24"
      />
      <Rect
        x="0"
        y="0"
        width={cardWidth}
        height={cardHeight}
        fill="url(#zigzagPattern)"
        rx="24"
      />

      <Circle
        cx={cardWidth - 20}
        cy="40"
        r="45"
        fill="none"
        stroke="#9A433B"
        strokeWidth="1"
        opacity="0.08"
      />
      <Circle
        cx={cardWidth - 20}
        cy="40"
        r="30"
        fill="none"
        stroke="#9A433B"
        strokeWidth="1"
        opacity="0.08"
      />
      <Circle
        cx={cardWidth - 20}
        cy="40"
        r="15"
        fill="none"
        stroke="#9A433B"
        strokeWidth="1"
        opacity="0.08"
      />

      <Circle
        cx="20"
        cy={cardHeight - 30}
        r="60"
        fill="none"
        stroke="#9A433B"
        strokeWidth="1"
        opacity="0.06"
      />
      <Circle
        cx="20"
        cy={cardHeight - 30}
        r="40"
        fill="none"
        stroke="#9A433B"
        strokeWidth="1"
        opacity="0.06"
      />
      <Circle
        cx="20"
        cy={cardHeight - 30}
        r="20"
        fill="none"
        stroke="#9A433B"
        strokeWidth="1"
        opacity="0.06"
      />

      <Circle
        cx={cardWidth / 2}
        cy="30"
        r="25"
        fill="none"
        stroke="#9A433B"
        strokeWidth="1"
        opacity="0.05"
      />

      <Path
        d={`M 0 ${cardHeight} L 80 ${cardHeight} L 0 ${cardHeight - 70} Z`}
        fill="#9A433B"
        opacity="0.04"
      />
      <Path
        d={`M ${cardWidth} 0 L ${cardWidth - 80} 0 L ${cardWidth} 70 Z`}
        fill="#9A433B"
        opacity="0.04"
      />
    </Svg>
  );

  return (
    <View style={styles.sessionCardWrapper}>
      <View style={StyleSheet.absoluteFill}>
        <SessionCardBackground />
      </View>
      <View style={styles.cardContent}>
        <View>
          <ThemedText style={styles.currentSessionTitle}>
            Current Session
          </ThemedText>
          <ThemedText style={styles.dailyFlowSubtitle}>Daily Flow</ThemedText>
        </View>

        <View style={styles.dateContainer}>
          <ThemedText style={styles.dateText}>{currentDate}</ThemedText>
        </View>

        <View>
          <ThemedText style={styles.focusLabel}>Today's Focus</ThemedText>
          <ThemedText style={styles.focusTime}>
            {todayTime.hours > 0 || todayTime.minutes > 0
              ? formattedTodayTime
              : "No time tracked yet"}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sessionCardWrapper: {
    margin: 20,
    marginTop: 20,
    marginBottom: 0,
    borderRadius: 24,
    shadowColor: "#9A433B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    overflow: "hidden",
    height: 220,
  },
  cardContent: {
    padding: 23,
    zIndex: 1,
    flex: 1,
    justifyContent: "space-between",
  },
  currentSessionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#7C2C26",
    marginBottom: 1,
  },
  dailyFlowSubtitle: {
    fontSize: 36,
    color: "#333",
    fontWeight: "500",
    lineHeight: 60,
  },
  dateContainer: {
    marginBottom: 8,
    marginTop: 4,
  },
  dateText: {
    fontSize: 14,
    color: "#666",
  },
  focusLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },
  focusTime: {
    fontSize: 20,
    fontWeight: "500",
    color: "#9A433B",
  },
});

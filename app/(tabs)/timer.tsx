// app/(tabs)/timer.tsx

// import {
//   TimerMode,
//   DEFAULT_TIMER_CONFIG,
//   formatTime,
//   getTimeForMode,
//   TimerSession,
// } from "@/types";
// import { useState, useEffect, useRef } from "react";
// import { View, Pressable, StyleSheet, Platform } from "react-native";
// import { ThemedText } from "@/components/themed-text";
// import {
//   Play,
//   Pause,
//   RotateCcw,
//   SkipForward,
//   Timer,
// } from "lucide-react-native";

// function TimerScreen() {
//   const [mode, setMode] = useState<TimerMode>("pomodoro");
//   const [timeLeft, setTimeLeft] = useState<number>(
//     getTimeForMode("pomodoro", DEFAULT_TIMER_CONFIG),
//   );
//   const [isRunning, setIsRunning] = useState<boolean>(false);
//   const intervalRef = useRef<NodeJS.Timeout | number>(null);

//   const [sessions, setSessions] = useState<TimerSession[]>([]);
//   const sessionStartRef = useRef<number>(0);

//   useEffect(() => {
//     setTimeLeft(getTimeForMode(mode, DEFAULT_TIMER_CONFIG));
//     setIsRunning(false);
//   }, [mode]);

//   // Timer logic
//   useEffect(() => {
//     if (isRunning && timeLeft > 0) {
//       intervalRef.current = setInterval(() => {
//         setTimeLeft((prev) => prev - 1);
//       }, 1000);
//     } else if (timeLeft === 0 && isRunning) {
//       setIsRunning(false);
//       // Timer complete - will add sound/notification later
//     }

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, [isRunning, timeLeft]);

//   const handleStart = () => {
//     sessionStartRef.current = Date.now();
//     setIsRunning(true);
//   };

//   const handlePause = () => {
//     if (sessionStartRef.current > 0) {
//       const duration = Math.floor(
//         (Date.now() - sessionStartRef.current) / 1000,
//       );

//       if (duration > 0) {
//         const session: TimerSession = {
//           startTime: Date.now(),
//           date: new Date().toISOString().split("T")[0],
//           duration,
//           mode: mode,
//         };

//         setSessions((prev) => [...prev, session]);
//       }

//       sessionStartRef.current = 0;
//     }
//     setIsRunning(false);
//   };

//   const handleReset = () => {
//     setIsRunning(false);
//     setTimeLeft(getTimeForMode(mode, DEFAULT_TIMER_CONFIG));
//   };

//   const handleNext = () => {
//     setIsRunning(false);
//     // Cycle through modes: pomodoro -> shortBreak -> longBreak -> pomodoro
//     switch (mode) {
//       case "pomodoro":
//         setMode("shortBreak");
//         break;
//       case "shortBreak":
//         setMode("longBreak");
//         break;
//       case "longBreak":
//         setMode("pomodoro");
//         break;
//     }
//   };

//   const handleModeChange = (newMode: TimerMode) => {
//     setMode(newMode);
//   };

//   return (
//     <View style={styles.container}>
//       {/* Mode Selector */}
//       <View style={styles.modeSelector}>
//         <Pressable
//           style={[
//             styles.modeButton,
//             mode === "pomodoro" && styles.modeButtonActive,
//           ]}
//           onPress={() => handleModeChange("pomodoro")}
//         >
//           <ThemedText
//             style={[
//               styles.modeText,
//               mode === "pomodoro" && styles.modeTextActive,
//             ]}
//           >
//             Pomodoro
//           </ThemedText>
//         </Pressable>

//         <Pressable
//           style={[
//             styles.modeButton,
//             mode === "shortBreak" && styles.modeButtonActive,
//           ]}
//           onPress={() => handleModeChange("shortBreak")}
//         >
//           <ThemedText
//             style={[
//               styles.modeText,
//               mode === "shortBreak" && styles.modeTextActive,
//             ]}
//           >
//             Short Break
//           </ThemedText>
//         </Pressable>

//         <Pressable
//           style={[
//             styles.modeButton,
//             mode === "longBreak" && styles.modeButtonActive,
//           ]}
//           onPress={() => handleModeChange("longBreak")}
//         >
//           <ThemedText
//             style={[
//               styles.modeText,
//               mode === "longBreak" && styles.modeTextActive,
//             ]}
//           >
//             Long Break
//           </ThemedText>
//         </Pressable>
//       </View>

//       {/* Timer Display */}
//       <View style={styles.timerContainer}>
//         <ThemedText style={styles.timerText}>{formatTime(timeLeft)}</ThemedText>
//       </View>

//       {/* Timer Controls */}
//       <View style={styles.controls}>
//         <Pressable
//           style={[styles.controlButton, styles.sideButton]}
//           onPress={handleReset}
//         >
//           <RotateCcw size={28} color="#fff" />
//         </Pressable>

//         {!isRunning ? (
//           <Pressable
//             style={[styles.controlButton, styles.centerButton]}
//             onPress={handleStart}
//           >
//             <Play size={36} color="#fff" />
//           </Pressable>
//         ) : (
//           <Pressable
//             style={[styles.controlButton, styles.centerButton]}
//             onPress={handlePause}
//           >
//             <Pause size={36} color="#fff" />
//           </Pressable>
//         )}

//         <Pressable
//           style={[styles.controlButton, styles.sideButton]}
//           onPress={handleNext}
//         >
//           <SkipForward size={28} color="#fff" />
//         </Pressable>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F5F5F3",
//     padding: 24,
//     // Remove flex: 1 to allow content to stack from top
//   },
//   modeSelector: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 4,
//     marginBottom: 48,
//     gap: 4,
//   },
//   modeButton: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   modeButtonActive: {
//     backgroundColor: "#9A433B",
//   },
//   modeText: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#666",
//   },
//   modeTextActive: {
//     color: "#fff",
//   },
//   timerContainer: {
//     alignItems: "center",
//     marginBottom: 48,
//   },
//   timerText: {
//     fontSize: 130,
//     fontWeight: "500",
//     fontFamily: Platform.select({
//       ios: "SF Pro Display",
//       android: "Roboto",
//     }),
//     color: "#9A433B",
//     lineHeight: 110,
//   },
//   controls: {
//     flexDirection: "row",
//     gap: 20,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   controlButton: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   sideButton: {
//     backgroundColor: "#767776",
//     width: 64,
//     height: 64,
//     borderRadius: 16,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   centerButton: {
//     backgroundColor: "#9A433B",
//     width: 80,
//     height: 80,
//     borderRadius: 20,
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#9A433B",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 5.3,
//     shadowRadius: 10,
//     elevation: 5,
//   },
// });

// export default TimerScreen;

import {
  TimerMode,
  DEFAULT_TIMER_CONFIG,
  formatTime,
  getTimeForMode,
} from "@/types";
import { useState, useEffect, useRef } from "react";
import { View, Pressable, StyleSheet, Platform } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react-native";
import { useTimer } from "@/components/context/timerContext";

function TimerScreen() {
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState<number>(
    getTimeForMode("pomodoro", DEFAULT_TIMER_CONFIG),
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | number>(null);

  const { startSession, endSession } = useTimer();

  useEffect(() => {
    setTimeLeft(getTimeForMode(mode, DEFAULT_TIMER_CONFIG));
    setIsRunning(false);
  }, [mode]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      endSession(); // End session when timer completes
      // Timer complete - will add sound/notification later
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

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
    setTimeLeft(getTimeForMode(mode, DEFAULT_TIMER_CONFIG));
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

  return (
    <View style={styles.container}>
      {/* Mode Selector */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F3",
    padding: 24,
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
});

export default TimerScreen;

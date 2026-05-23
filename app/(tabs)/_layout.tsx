// app/(tabs)/_layout.tsx

import { Tabs } from "expo-router";
import { StyleSheet, Platform, View } from "react-native";
import { Timer, BarChart3, CheckSquare, Settings } from "lucide-react-native";
import { ThemedText } from "@/components/themed-text";
import { TimerProvider } from "@/components/context/timerContext";

export default function TabsLayout() {
  return (
    <TimerProvider>
      <Tabs
        screenOptions={{
          headerShown: true,
          header: () => <ChronosHeader />,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: "#9A433B",
          tabBarInactiveTintColor: "#999",
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarShowLabel: true,
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tabs.Screen
          name="timer"
          options={{
            title: "Timer",
            tabBarIcon: ({ focused, color, size }) => (
              <Timer
                size={size}
                color={color}
                strokeWidth={focused ? 2.5 : 2}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="task"
          options={{
            title: "Tasks",
            tabBarIcon: ({ focused, color, size }) => (
              <CheckSquare
                size={size}
                color={color}
                strokeWidth={focused ? 2.5 : 2}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="stats"
          options={{
            title: "Stats",
            tabBarIcon: ({ focused, color, size }) => (
              <BarChart3
                size={size}
                color={color}
                strokeWidth={focused ? 2.5 : 2}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ focused, color, size }) => (
              <Settings
                size={size}
                color={color}
                strokeWidth={focused ? 2.5 : 2}
              />
            ),
          }}
        />
      </Tabs>
    </TimerProvider>
  );
}

function ChronosHeader() {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <ThemedText style={styles.chronosTitle}>CHRONOS</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#F5F5F3",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 0,
  },
  headerContent: {
    alignItems: "center",
  },
  chronosTitle: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: Platform.select({
      ios: "SF Pro Text",
      android: "Roboto",
    }),
    color: "#9A433B",
    letterSpacing: 3,
    marginTop: 20,
  },
  tabBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    height: 65,
    paddingBottom: Platform.OS === "ios" ? 20 : 12,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
    borderTopWidth: 0,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: "500",
    fontFamily: Platform.select({
      ios: "SF Pro Text",
      android: "Roboto",
    }),
    marginTop: 4,
  },
});

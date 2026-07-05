// app/(tabs)/stats.tsx

import { StyleSheet, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { CurrentSessionCard } from "@/components/current-session-card";
import { WeeklyStatsChart } from "@/components/weekly-session-graph";
import { useTimer } from "@/components/context/timerContext";

export default function StatsScreen() {
  const { sessions } = useTimer();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

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
      <CurrentSessionCard />
      <WeeklyStatsChart sessions={sessions} />
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
    paddingHorizontal: 0,
  },
  bottomSpacer: {
    height: 20,
  },
});

// app/(tabs)/settings.tsx

import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { ThemedText } from "@/components/themed-text";
import { TimerMode } from "@/types";
import { useSettings } from "@/components/context/timer-settings";
import { useUser, useClerk } from "@clerk/expo";
import {
  Save,
  Clock,
  Bell,
  Volume2,
  Vibrate,
  LogOut,
  User,
  Mail,
} from "lucide-react-native";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { user } = useUser();
  const { signOut } = useClerk();

  const {
    timerConfig,
    alarmSettings,
    updateTimerConfig,
    updateAlarmSettings,
    resetToDefaults,
    isLoading,
  } = useSettings();

  const updateTimerConfigValue = (mode: TimerMode, value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue < 1 || numValue > 120) {
      Alert.alert(
        "Invalid Value",
        "Please enter a value between 1 and 120 minutes.",
      );
      return;
    }
    updateTimerConfig({ [mode]: numValue });
  };

  const updateAlarmSetting = <K extends keyof typeof alarmSettings>(
    key: K,
    value: (typeof alarmSettings)[K],
  ) => {
    updateAlarmSettings({ [key]: value });
  };

  const handleReset = () => {
    Alert.alert(
      "Reset Settings",
      "Are you sure you want to reset all settings to default?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: resetToDefaults,
        },
      ],
    );
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => signOut(),
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ThemedText>Loading settings...</ThemedText>
      </View>
    );
  }

  // Get user details
  const firstName = user?.firstName || "User";
  const emailAddress = user?.emailAddresses?.[0]?.emailAddress || "No email";
  const userInitial = firstName.charAt(0).toUpperCase();

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: tabBarHeight + insets.bottom + 20 },
      ]}
    >
      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {user?.imageUrl ? (
              <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <ThemedText style={styles.avatarText}>{userInitial}</ThemedText>
              </View>
            )}
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.profileRow}>
              <User size={16} color="#666" />
              <ThemedText style={styles.profileName}>{firstName}</ThemedText>
            </View>
            <View style={styles.profileRow}>
              <Mail size={16} color="#666" />
              <ThemedText style={styles.profileEmail}>
                {emailAddress}
              </ThemedText>
            </View>
          </View>
        </View>
      </View>

      {/* Timer Configuration Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Clock size={20} color="#9A433B" />
          <ThemedText style={styles.sectionTitle}>
            Timer Configuration
          </ThemedText>
        </View>

        <View style={styles.card}>
          <TimerInput
            label="Pomodoro"
            value={timerConfig.pomodoro}
            onChangeText={(value) => updateTimerConfigValue("pomodoro", value)}
          />
          <TimerInput
            label="Short Break"
            value={timerConfig.shortBreak}
            onChangeText={(value) =>
              updateTimerConfigValue("shortBreak", value)
            }
          />
          <TimerInput
            label="Long Break"
            value={timerConfig.longBreak}
            onChangeText={(value) => updateTimerConfigValue("longBreak", value)}
            isLast
          />
        </View>
      </View>

      {/* Alarm Settings Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Bell size={20} color="#9A433B" />
          <ThemedText style={styles.sectionTitle}>Alarm Settings</ThemedText>
        </View>

        <View style={styles.card}>
          <SettingSwitch
            label="Enable Alarm"
            value={alarmSettings.enabled}
            onValueChange={(value) => updateAlarmSetting("enabled", value)}
            icon={<Bell size={18} color="#666" />}
          />

          <SettingSwitch
            label="Vibration"
            value={alarmSettings.vibration}
            onValueChange={(value) => updateAlarmSetting("vibration", value)}
            icon={<Vibrate size={18} color="#666" />}
            disabled={!alarmSettings.enabled}
          />

          <View style={[styles.settingItem, styles.settingItemLast]}>
            <View style={styles.settingLeft}>
              <Volume2 size={18} color="#666" />
              <ThemedText style={styles.settingLabel}>Sound</ThemedText>
            </View>
            <Pressable
              style={[
                styles.soundButton,
                !alarmSettings.enabled && styles.soundButtonDisabled,
              ]}
              onPress={() => {
                Alert.alert(
                  "Select Sound",
                  "Choose your alarm sound",
                  [
                    {
                      text: "Default",
                      onPress: () => updateAlarmSetting("sound", "default"),
                    },
                    {
                      text: "Gentle",
                      onPress: () => updateAlarmSetting("sound", "gentle"),
                    },
                    {
                      text: "Classic",
                      onPress: () => updateAlarmSetting("sound", "classic"),
                    },
                    {
                      text: "Marimba",
                      onPress: () => updateAlarmSetting("sound", "marimba"),
                    },
                    { text: "Cancel", style: "cancel" },
                  ],
                  { cancelable: true },
                );
              }}
              disabled={!alarmSettings.enabled}
            >
              <ThemedText style={styles.soundButtonText}>
                {alarmSettings.sound.charAt(0).toUpperCase() +
                  alarmSettings.sound.slice(1)}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Pressable
          style={[styles.button, styles.resetButton]}
          onPress={handleReset}
        >
          <ThemedText style={styles.resetButtonText}>
            Reset to Defaults
          </ThemedText>
        </Pressable>

        <Pressable
          style={[styles.button, styles.signOutButton]}
          onPress={handleSignOut}
        >
          <LogOut size={20} color="#E67E73" />
          <ThemedText style={styles.signOutButtonText}>Sign Out</ThemedText>
        </Pressable>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

// Helper Components
const TimerInput = ({
  label,
  value,
  onChangeText,
  isLast = false,
}: {
  label: string;
  value: number;
  onChangeText: (text: string) => void;
  isLast?: boolean;
}) => (
  <View
    style={[
      styles.timerInputContainer,
      isLast && styles.timerInputContainerLast,
    ]}
  >
    <ThemedText style={styles.timerInputLabel}>{label}</ThemedText>
    <View style={styles.timerInputWrapper}>
      <Pressable
        style={styles.timerInputButton}
        onPress={() => onChangeText(Math.max(1, value - 1).toString())}
      >
        <ThemedText style={styles.timerInputButtonText}>−</ThemedText>
      </Pressable>

      <View style={styles.timerValueContainer}>
        <ThemedText style={styles.timerValue}>{value}</ThemedText>
      </View>

      <Pressable
        style={styles.timerInputButton}
        onPress={() => onChangeText(Math.min(120, value + 1).toString())}
      >
        <ThemedText style={styles.timerInputButtonText}>+</ThemedText>
      </Pressable>
    </View>
    <ThemedText style={styles.timerInputUnit}>minutes</ThemedText>
  </View>
);

const SettingSwitch = ({
  label,
  value,
  onValueChange,
  icon,
  disabled = false,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}) => (
  <View style={[styles.settingItem, disabled && styles.settingItemDisabled]}>
    <View style={styles.settingLeft}>
      {icon}
      <ThemedText
        style={[styles.settingLabel, disabled && styles.settingLabelDisabled]}
      >
        {label}
      </ThemedText>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: "#ddd", true: "#9A433B" }}
      thumbColor={value ? "#fff" : "#fff"}
      disabled={disabled}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F3",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileSection: {
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#9A433B",
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#9A433B",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#9A433B",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "600",
    color: "#fff",
  },
  profileInfo: {
    alignItems: "center",
    gap: 6,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
  },
  // Section Styles
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  // Timer Input Styles
  timerInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  timerInputContainerLast: {
    borderBottomWidth: 0,
  },
  timerInputLabel: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  timerInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timerValueContainer: {
    minWidth: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  timerValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  timerInputButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  timerInputButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
  },
  timerInputUnit: {
    fontSize: 14,
    color: "#999",
    marginLeft: 8,
    width: 55,
  },
  // Setting Switch Styles
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingItemDisabled: {
    opacity: 0.5,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: "#333",
  },
  settingLabelDisabled: {
    color: "#999",
  },
  soundButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  soundButtonDisabled: {
    opacity: 0.5,
  },
  soundButtonText: {
    fontSize: 14,
    color: "#333",
    textTransform: "capitalize",
  },
  // Action Buttons
  actionButtons: {
    gap: 12,
    marginTop: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
  },
  resetButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E67E73",
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E67E73",
  },
  signOutButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E67E73",
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E67E73",
  },
  bottomSpacer: {
    height: 20,
  },
});

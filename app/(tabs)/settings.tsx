// app/(tabs)/settings.tsx

import { View, StyleSheet, Pressable, Platform } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/expo";
import { LogOut, Bell, Moon, Globe } from "lucide-react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Settings</ThemedText>

      <View style={styles.settingsList}>
        <Pressable style={styles.settingItem}>
          <Bell size={24} color="#666" />
          <ThemedText style={styles.settingText}>Notifications</ThemedText>
        </Pressable>

        <Pressable style={styles.settingItem}>
          <Moon size={24} color="#666" />
          <ThemedText style={styles.settingText}>Dark Mode</ThemedText>
        </Pressable>

        <Pressable style={styles.settingItem}>
          <Globe size={24} color="#666" />
          <ThemedText style={styles.settingText}>Language</ThemedText>
        </Pressable>

        <Pressable
          style={[styles.settingItem, styles.signOutItem]}
          onPress={handleSignOut}
        >
          <LogOut size={24} color="#E67E73" />
          <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
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
  settingsList: {
    gap: 12,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: "#000",
  },
  signOutItem: {
    marginTop: 20,
  },
  signOutText: {
    fontSize: 16,
    color: "#E67E73",
    fontWeight: "600",
  },
});

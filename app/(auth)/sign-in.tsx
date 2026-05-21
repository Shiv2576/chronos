// app/(auth)/sign-in.tsx

import { ThemedText } from "@/components/themed-text";

import { useSignIn } from "@clerk/expo";

import { Link, useRouter } from "expo-router";

import React from "react";

import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

export default function Page() {
  const { signIn, errors, fetchStatus } = useSignIn();

  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");

  const [password, setPassword] = React.useState("");

  const handleSubmit = async () => {
    try {
      const { error } = await signIn.password({
        emailAddress,
        password,
      });

      if (error) {
        console.error(JSON.stringify(error, null, 2));
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize();

        router.replace("/onboarding");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F5F5F3" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* CHRONOS Title */}
          <ThemedText style={styles.chronosTitle}>CHRONOS</ThemedText>

          {/* Subtitle */}
          <ThemedText style={styles.subtitle}>Join the Rhythm</ThemedText>

          {/* Description */}
          <ThemedText
            style={styles.description}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            Step into a more intentional way of working.
          </ThemedText>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              value={emailAddress}
              placeholder="Email address"
              placeholderTextColor="#999"
              onChangeText={setEmailAddress}
            />

            {errors.fields.identifier && (
              <ThemedText style={styles.error}>
                {errors.fields.identifier.message}
              </ThemedText>
            )}
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={password}
              placeholder="Password"
              placeholderTextColor="#999"
              onChangeText={setPassword}
            />

            {errors.fields.password && (
              <ThemedText style={styles.error}>
                {errors.fields.password.message}
              </ThemedText>
            )}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              (!emailAddress || !password || fetchStatus === "fetching") &&
                styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSubmit}
            disabled={!emailAddress || !password || fetchStatus === "fetching"}
          >
            <ThemedText style={styles.buttonText}>Continue</ThemedText>
          </Pressable>

          <View style={styles.linkContainer}>
            <ThemedText style={styles.linkText}>
              Don&apos;t have an account?
            </ThemedText>

            <Link href="/(auth)/sign-up">
              <ThemedText style={styles.signUpLink}>Sign up</ThemedText>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 100,
  },

  chronosTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Inter-Bold", // or "Inter-SemiBold"
    color: "#9A433B",
    letterSpacing: 2,
    lineHeight: 52,
    paddingVertical: 5,
    marginBottom: 80,
  },

  subtitle: {
    fontSize: 40,
    fontWeight: "300",
    fontFamily: "Inter-Light",
    color: "#000000",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 52,
  },

  description: {
    fontSize: 20,
    fontWeight: "400",
    fontFamily: "Inter-Regular",
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 10,
    marginBottom: 40,
  },

  inputWrapper: {
    width: "100%",
    alignItems: "center",
    gap: 4,
    marginBottom: 16,
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    fontWeight: "400",
    fontFamily: Platform.select({
      ios: "SF Pro Text",
      android: "Roboto",
      default: "System",
    }),
    backgroundColor: "#fff",
  },

  button: {
    width: "100%",
    backgroundColor: "#9A433B",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 20,
  },

  buttonPressed: {
    opacity: 0.85,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Platform.select({
      ios: "SF Pro Text",
      android: "Roboto",
      default: "System",
    }),
  },

  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    marginTop: 10,
  },

  linkText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "400",
    fontFamily: Platform.select({
      ios: "SF Pro Text",
      android: "Roboto",
      default: "System",
    }),
  },

  signUpLink: {
    color: "#E67E73",
    fontWeight: "500",
    fontSize: 14,
    fontFamily: Platform.select({
      ios: "SF Pro Text",
      android: "Roboto",
      default: "System",
    }),
  },

  error: {
    color: "#E67E73",
    fontSize: 13,
    fontWeight: "400",
    fontFamily: Platform.select({
      ios: "SF Pro Text",
      android: "Roboto",
      default: "System",
    }),
    width: "100%",
  },
});

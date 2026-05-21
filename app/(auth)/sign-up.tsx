// app/(auth)/sign-up.tsx

import { ThemedText } from "@/components/themed-text";

import { useAuth, useSignUp } from "@clerk/expo";

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
  const { signUp, errors } = useSignUp();

  const { isSignedIn } = useAuth();

  const router = useRouter();

  const [firstName, setFirstName] = React.useState("");

  const [emailAddress, setEmailAddress] = React.useState("");

  const [password, setPassword] = React.useState("");

  const [code, setCode] = React.useState("");

  const [showVerification, setShowVerification] = React.useState(false);

  const handleSubmit = async () => {
    try {
      const { error } = await signUp.password({
        emailAddress,
        password,
        firstName,
      });

      if (error) {
        console.error(JSON.stringify(error, null, 2));
        return;
      }

      await signUp.verifications.sendEmailCode();

      setShowVerification(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleVerify = async () => {
    try {
      await signUp.verifications.verifyEmailCode({
        code,
      });

      if (signUp.status === "complete") {
        await signUp.finalize();

        router.replace("/onboarding");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const resetSignupFlow = () => {
    setShowVerification(false);

    setCode("");
  };

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  // =========================
  // VERIFICATION SCREEN
  // =========================

  if (showVerification) {
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
            <ThemedText style={styles.chronosTitle}>CHRONOS</ThemedText>

            <ThemedText style={styles.verifyTitle}>Verify Email</ThemedText>

            <ThemedText style={styles.description}>
              Enter the verification code sent to your email
            </ThemedText>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={code}
                placeholder="Verification code"
                placeholderTextColor="#999"
                onChangeText={setCode}
                keyboardType="numeric"
              />

              {errors.fields.code && (
                <ThemedText style={styles.error}>
                  {errors.fields.code.message}
                </ThemedText>
              )}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleVerify}
            >
              <ThemedText style={styles.buttonText}>Verify Email</ThemedText>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => signUp.verifications.sendEmailCode()}
            >
              <ThemedText style={styles.secondaryButtonText}>
                Resend code
              </ThemedText>
            </Pressable>

            <Pressable style={styles.backButton} onPress={resetSignupFlow}>
              <ThemedText style={styles.backButtonText}>
                Back to Sign Up
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // =========================
  // SIGNUP SCREEN
  // =========================

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

          {/* Main Title */}
          <ThemedText style={styles.subtitle}>Create Account</ThemedText>

          {/* Description */}
          <ThemedText style={styles.description}>
            Start your productivity journey
          </ThemedText>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={firstName}
              placeholder="Your name"
              placeholderTextColor="#999"
              onChangeText={setFirstName}
            />
          </View>

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
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              (!firstName || !emailAddress || !password) &&
                styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSubmit}
            disabled={!firstName || !emailAddress || !password}
          >
            <ThemedText style={styles.buttonText}>Create Account</ThemedText>
          </Pressable>

          <View style={styles.linkContainer}>
            <ThemedText style={styles.linkText}>
              Already have an account?
            </ThemedText>

            <Link href="/(auth)/sign-in">
              <ThemedText style={styles.signInLink}>Sign in</ThemedText>
            </Link>
          </View>

          <View nativeID="clerk-captcha" />
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
    fontFamily: "Inter-Bold",
    color: "#9A433B",
    letterSpacing: 2,
    lineHeight: 52,
    paddingVertical: 5,
    marginBottom: 40,
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

  verifyTitle: {
    fontSize: 40,
    fontWeight: "300",
    fontFamily: Platform.select({
      ios: "SF Pro Display",
      android: "Roboto",
      default: "System",
    }),
    color: "#000000",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 52,
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

  secondaryButton: {
    alignItems: "center",
    marginTop: 6,
  },

  secondaryButtonText: {
    color: "#9A433B",
    fontWeight: "500",
    fontSize: 14,
    fontFamily: Platform.select({
      ios: "SF Pro Text",
      android: "Roboto",
      default: "System",
    }),
  },

  backButton: {
    marginTop: 10,
    alignItems: "center",
  },

  backButtonText: {
    color: "#888",
    fontWeight: "500",
    fontSize: 14,
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

  signInLink: {
    color: "#E67E73",
    fontWeight: "600",
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

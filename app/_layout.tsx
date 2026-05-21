import { ClerkLoaded, ClerkLoading, ClerkProvider, useUser } from "@clerk/expo";

import { tokenCache } from "@clerk/expo/token-cache";

import { Redirect, Slot, useSegments } from "expo-router";

import { ActivityIndicator, View } from "react-native";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoading>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      </ClerkLoading>

      <ClerkLoaded>
        <AppNavigator />
      </ClerkLoaded>
    </ClerkProvider>
  );
}

function AppNavigator() {
  const { isSignedIn, user } = useUser();

  const segments = useSegments();

  const inAuthScreen = segments[0] === "(auth)";

  const inOnboarding = segments[0] === "onboarding";

  const hasOnboarded = user?.unsafeMetadata?.hasOnboarded;

  if (!isSignedIn) {
    if (inAuthScreen) {
      return <Slot />;
    }

    return <Redirect href="/(auth)/sign-in" />;
  }

  if (!hasOnboarded) {
    if (inOnboarding) {
      return <Slot />;
    }

    return <Redirect href="/onboarding" />;
  }

  if (inAuthScreen) {
    return <Redirect href="/(tabs)/timer" />;
  }

  if (inOnboarding) {
    return <Redirect href="/(tabs)/timer" />;
  }

  return <Slot />;
}

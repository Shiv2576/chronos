// app/onboarding.tsx
import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  FlatList,
} from "react-native";
import { useUser } from "@clerk/expo";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Welcome to AppName",
    description:
      "Discover amazing features and enhance your experience with our app",
    image: require("../assets/images/onboard2.jpg"),
  },
  {
    id: "2",
    title: "Easy to Use",
    description:
      "Intuitive interface designed for everyone. Get started in minutes",
    image: require("../assets/images/onboard3.jpg"),
  },
  {
    id: "3",
    title: "Stay Connected",
    description: "Get real-time updates and never miss important notifications",
    image: require("../assets/images/onboard4.jpg"),
  },
];

export default function OnboardingScreen() {
  const flatListRef = useRef<FlatList>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const { user } = useUser();
  const router = useRouter();

  const handleGetStarted = useCallback(async () => {
    try {
      if (user) {
        await user.update({
          unsafeMetadata: {
            hasOnboarded: true,
          },
        });
      }
      router.replace("/(tabs)/timer");
    } catch (error) {
      console.error("Error saving onboarding status:", error);
    }
  }, [user, router]);

  const handleNext = useCallback(() => {
    if (currentPage < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentPage + 1,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  }, [currentPage, handleGetStarted]);

  const handleSkip = useCallback(() => {
    flatListRef.current?.scrollToIndex({
      index: slides.length - 1,
      animated: true,
    });
  }, []);

  const handleMomentumScrollEnd = useCallback((e: any) => {
    const newPage = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentPage(newPage);
  }, []);

  const renderSlide = useCallback(({ item }: { item: (typeof slides)[0] }) => {
    return (
      <View style={styles.slideContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={item.image}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item: (typeof slides)[0]) => item.id, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {currentPage < slides.length - 1 && (
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={keyExtractor}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={renderSlide}
      />

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {slides.map((index, i) => (
          <View
            key={index.id}
            style={[
              styles.paginationDot,
              currentPage === i && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>

      {/* Next/Get Started Button */}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {currentPage === slides.length - 1 ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  slideContainer: {
    width: width,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  skipButton: {
    position: "absolute",
    top: height * 0.06,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  imageContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
  },
  textContainer: {
    flex: 0.3,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: "#007AFF",
    width: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    alignSelf: "center",
    marginBottom: 40,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

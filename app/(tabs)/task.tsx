// app/(tabs)/task.tsx

import { View, StyleSheet, FlatList, Pressable, Platform } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useState } from "react";
import { Plus, Check } from "lucide-react-native";

export default function TaskScreen() {
  const [tasks, setTasks] = useState([
    { id: "1", title: "Complete project", completed: false },
    { id: "2", title: "Review code", completed: true },
  ]);

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Tasks</ThemedText>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Pressable
              style={[
                styles.checkbox,
                item.completed && styles.checkboxChecked,
              ]}
            >
              {item.completed && <Check size={16} color="#fff" />}
            </Pressable>
            <ThemedText
              style={[styles.taskTitle, item.completed && styles.taskCompleted]}
            >
              {item.title}
            </ThemedText>
          </View>
        )}
      />

      <Pressable style={styles.addButton}>
        <Plus size={24} color="#fff" />
      </Pressable>
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
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#9A433B",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#9A433B",
  },
  taskTitle: {
    fontSize: 16,
    color: "#000",
  },
  taskCompleted: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#9A433B",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

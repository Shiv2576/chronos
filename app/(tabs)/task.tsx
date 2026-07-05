// app/(tabs)/index.tsx

import { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  Modal,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { ThemedText } from "@/components/themed-text";
import { Task, getActiveTasks, getCompletedTasks } from "@/types";
import { Plus, Edit2, Trash2, Check, X, Archive } from "lucide-react-native";

export default function TaskScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [timerDuration, setTimerDuration] = useState(25);

  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const activeTasks = getActiveTasks(tasks);
  const completedTasks = getCompletedTasks(tasks);
  const displayedTasks = showCompleted ? completedTasks : activeTasks;

  const addTask = () => {
    if (!newTaskName.trim()) {
      Alert.alert("Error", "Please enter a task name");
      return;
    }
    const newTask: Task = {
      id: Date.now().toString(),
      name: newTaskName.trim(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(), // Add updatedAt
      pomodorosCompleted: 0,
      timerDuration: timerDuration, // Add timerDuration
    };
    setTasks([newTask, ...tasks]);
    setNewTaskName("");
    setModalVisible(false);
  };

  const handleEditTask = () => {
    if (!editingTask || !newTaskName.trim()) return;
    setTasks(
      tasks.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              name: newTaskName.trim(),
              updatedAt: new Date(),
            }
          : task,
      ),
    );
    setEditModalVisible(false);
    setEditingTask(null);
    setNewTaskName("");
  };

  const deleteTask = (id: string) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setTasks(tasks.filter((task) => task.id !== id));
        },
      },
    ]);
  };

  const toggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: new Date() }
          : task,
      ),
    );
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setNewTaskName(task.name);
    setTimerDuration(task.timerDuration || 25);
    setEditModalVisible(true);
  };

  const clearCompleted = () => {
    if (completedTasks.length === 0) return;
    Alert.alert(
      "Clear Completed",
      `Delete ${completedTasks.length} completed task(s)?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            setTasks(activeTasks);
          },
        },
      ],
    );
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <View style={[styles.taskItem, item.completed && styles.taskItemCompleted]}>
      <Pressable
        style={styles.checkbox}
        onPress={() => toggleComplete(item.id)}
      >
        {item.completed && <Check size={16} color="#fff" />}
      </Pressable>
      <View style={styles.taskContent}>
        <ThemedText
          style={[styles.taskName, item.completed && styles.taskNameCompleted]}
        >
          {item.name}
        </ThemedText>
        <View style={styles.taskStats}>
          <ThemedText style={styles.taskStatsText}>
            {item.pomodorosCompleted} pomodoros
          </ThemedText>
          <ThemedText style={styles.taskStatsText}>•</ThemedText>
          <ThemedText style={styles.taskStatsText}>
            {item.timerDuration || 25} min sessions
          </ThemedText>
        </View>
      </View>
      <View style={styles.taskActions}>
        {!item.completed && (
          <Pressable
            style={styles.editButton}
            onPress={() => openEditModal(item)}
          >
            <Edit2 size={18} color="#666" />
          </Pressable>
        )}
        <Pressable
          style={styles.deleteButton}
          onPress={() => deleteTask(item.id)}
        >
          <Trash2 size={18} color="#E67E73" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.contentContainer,
        {
          paddingBottom: tabBarHeight + insets.bottom + 20,
        },
      ]}
    >
      <View style={styles.taskSection}>
        <View style={styles.taskSectionHeader}>
          <ThemedText style={styles.taskSectionTitle}>Your Tasks</ThemedText>
          <Pressable
            onPress={() => setModalVisible(true)}
            style={styles.addTaskButton}
          >
            <Plus size={20} color="#9A433B" />
          </Pressable>
        </View>

        <View style={styles.tabSelector}>
          <Pressable
            style={[styles.tab, !showCompleted && styles.tabActive]}
            onPress={() => setShowCompleted(false)}
          >
            <ThemedText
              style={[styles.tabText, !showCompleted && styles.tabTextActive]}
            >
              Active ({activeTasks.length})
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.tab, showCompleted && styles.tabActive]}
            onPress={() => setShowCompleted(true)}
          >
            <ThemedText
              style={[styles.tabText, showCompleted && styles.tabTextActive]}
            >
              Completed ({completedTasks.length})
            </ThemedText>
          </Pressable>
        </View>

        <FlatList
          data={displayedTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTaskItem}
          scrollEnabled={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Archive size={48} color="#ccc" />
              <ThemedText style={styles.emptyStateText}>
                {showCompleted
                  ? "No completed tasks yet"
                  : "No active tasks. Add your first task!"}
              </ThemedText>
            </View>
          }
        />

        {showCompleted && completedTasks.length > 0 && (
          <Pressable style={styles.clearButton} onPress={clearCompleted}>
            <Trash2 size={20} color="#E67E73" />
            <ThemedText style={styles.clearButtonText}>Clear All</ThemedText>
          </Pressable>
        )}

        <View style={styles.bottomSpacer} />
      </View>

      {/* Add Task Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Add New Task</ThemedText>
              <Pressable onPress={() => setModalVisible(false)}>
                <X size={24} color="#666" />
              </Pressable>
            </View>
            <TextInput
              style={styles.input}
              placeholder="What do you want to accomplish?"
              placeholderTextColor="#999"
              value={newTaskName}
              onChangeText={setNewTaskName}
              autoFocus
              onSubmitEditing={addTask}
            />
            <View style={styles.durationContainer}>
              <ThemedText style={styles.durationLabel}>
                Pomodoro Duration (minutes):
              </ThemedText>
              <View style={styles.durationButtons}>
                {[15, 25, 30, 45, 60].map((duration) => (
                  <Pressable
                    key={duration}
                    style={[
                      styles.durationButton,
                      timerDuration === duration && styles.durationButtonActive,
                    ]}
                    onPress={() => setTimerDuration(duration)}
                  >
                    <ThemedText
                      style={[
                        styles.durationButtonText,
                        timerDuration === duration &&
                          styles.durationButtonTextActive,
                      ]}
                    >
                      {duration}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setNewTaskName("");
                  setTimerDuration(25);
                }}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.createButton]}
                onPress={addTask}
              >
                <ThemedText style={styles.createButtonText}>
                  Add Task
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Task Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Edit Task</ThemedText>
              <Pressable onPress={() => setEditModalVisible(false)}>
                <X size={24} color="#666" />
              </Pressable>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Task name"
              placeholderTextColor="#999"
              value={newTaskName}
              onChangeText={setNewTaskName}
              autoFocus
              onSubmitEditing={handleEditTask}
            />
            <View style={styles.durationContainer}>
              <ThemedText style={styles.durationLabel}>
                Pomodoro Duration (minutes):
              </ThemedText>
              <View style={styles.durationButtons}>
                {[15, 25, 30, 45, 60].map((duration) => (
                  <Pressable
                    key={duration}
                    style={[
                      styles.durationButton,
                      timerDuration === duration && styles.durationButtonActive,
                    ]}
                    onPress={() => setTimerDuration(duration)}
                  >
                    <ThemedText
                      style={[
                        styles.durationButtonText,
                        timerDuration === duration &&
                          styles.durationButtonTextActive,
                      ]}
                    >
                      {duration}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setEditModalVisible(false);
                  setEditingTask(null);
                  setNewTaskName("");
                  setTimerDuration(25);
                }}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.createButton]}
                onPress={handleEditTask}
              >
                <ThemedText style={styles.createButtonText}>Save</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F3",
  },
  contentContainer: {
    paddingHorizontal: 0,
  },
  taskSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  taskSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 24,
  },
  taskSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  addTaskButton: {
    padding: 8,
  },
  tabSelector: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  tabActive: {
    backgroundColor: "#9A433B",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  tabTextActive: {
    color: "#fff",
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  taskItemCompleted: {
    opacity: 0.6,
    backgroundColor: "#f9f9f9",
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
  taskContent: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  taskNameCompleted: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  taskStats: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  taskStatsText: {
    fontSize: 11,
    color: "#999",
  },
  taskActions: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff",
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E67E73",
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E67E73",
  },
  bottomSpacer: {
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    gap: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  durationContainer: {
    gap: 12,
  },
  durationLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  durationButtons: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  durationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  durationButtonActive: {
    backgroundColor: "#9A433B",
    borderColor: "#9A433B",
  },
  durationButtonText: {
    fontSize: 14,
    color: "#666",
  },
  durationButtonTextActive: {
    color: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "600",
  },
  createButton: {
    backgroundColor: "#9A433B",
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

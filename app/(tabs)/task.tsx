// app/(tabs)/task.tsx

// import { useState, useEffect } from "react";
// import {
//   View,
//   StyleSheet,
//   Platform,
//   FlatList,
//   TextInput,
//   Modal,
//   Pressable,
//   Alert,
//   ScrollView,
//   ActivityIndicator,
//   useWindowDimensions,
// } from "react-native";
// import { ThemedText } from "@/components/themed-text";
// import { Task, getActiveTasks, getCompletedTasks } from "@/types";
// import {
//   Plus,
//   Edit2,
//   Trash2,
//   Check,
//   X,
//   Archive,
//   Sparkles,
//   RefreshCw,
// } from "lucide-react-native";
// import Svg, {
//   Circle,
//   Line,
//   G,
//   Defs,
//   Pattern,
//   Rect,
//   LinearGradient,
//   Stop,
//   Path,
// } from "react-native-svg";
// import { useTimer } from "@/components/context/timerContext";

// export default function TaskScreen() {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [editModalVisible, setEditModalVisible] = useState(false);
//   const [newTaskName, setNewTaskName] = useState("");
//   const [editingTask, setEditingTask] = useState<Task | null>(null);
//   const [showCompleted, setShowCompleted] = useState(false);
//   const [currentDate, setCurrentDate] = useState("");
//   const [cardDimensions, setCardDimensions] = useState({ width: 0, height: 0 });

//   const { formattedTodayTime, todayTime } = useTimer();

//   const activeTasks = getActiveTasks(tasks);
//   const completedTasks = getCompletedTasks(tasks);
//   const displayedTasks = showCompleted ? completedTasks : activeTasks;

//   useEffect(() => {
//     const date = new Date();
//     const formattedDate = date.toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//     setCurrentDate(formattedDate);
//   }, []);

//   const addTask = () => {
//     if (!newTaskName.trim()) {
//       Alert.alert("Error", "Please enter a task name");
//       return;
//     }
//     const newTask: Task = {
//       id: Date.now().toString(),
//       name: newTaskName.trim(),
//       completed: false,
//       createdAt: new Date(),
//       pomodorosCompleted: 0,
//     };
//     setTasks([newTask, ...tasks]);
//     setNewTaskName("");
//     setModalVisible(false);
//   };

//   const handleEditTask = () => {
//     if (!editingTask || !newTaskName.trim()) return;
//     setTasks(
//       tasks.map((task) =>
//         task.id === editingTask.id
//           ? { ...task, name: newTaskName.trim(), updatedAt: new Date() }
//           : task,
//       ),
//     );
//     setEditModalVisible(false);
//     setEditingTask(null);
//     setNewTaskName("");
//   };

//   const deleteTask = (id: string) => {
//     Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Delete",
//         style: "destructive",
//         onPress: () => {
//           setTasks(tasks.filter((task) => task.id !== id));
//         },
//       },
//     ]);
//   };

//   const toggleComplete = (id: string) => {
//     setTasks(
//       tasks.map((task) =>
//         task.id === id ? { ...task, completed: !task.completed } : task,
//       ),
//     );
//   };

//   const openEditModal = (task: Task) => {
//     setEditingTask(task);
//     setNewTaskName(task.name);
//     setEditModalVisible(true);
//   };

//   const clearCompleted = () => {
//     if (completedTasks.length === 0) return;
//     Alert.alert(
//       "Clear Completed",
//       `Delete ${completedTasks.length} completed task(s)?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Clear",
//           style: "destructive",
//           onPress: () => {
//             setTasks(activeTasks);
//           },
//         },
//       ],
//     );
//   };

//   // SVG Background Component
//   const SessionCardBackground = ({
//     width,
//     height,
//   }: {
//     width: number;
//     height: number;
//   }) => (
//     <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
//       <Defs>
//         <LinearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//           <Stop offset="0%" stopColor="#FFFFFF" />
//           <Stop offset="50%" stopColor="#FDF8F7" />
//           <Stop offset="100%" stopColor="#FDF5F3" />
//         </LinearGradient>

//         <Pattern
//           id="dotPattern"
//           x="0"
//           y="0"
//           width="30"
//           height="30"
//           patternUnits="userSpaceOnUse"
//         >
//           <Circle cx="15" cy="15" r="1.5" fill="#9A433B" opacity="0.12" />
//         </Pattern>

//         <Pattern
//           id="linePattern"
//           x="0"
//           y="0"
//           width="60"
//           height="60"
//           patternUnits="userSpaceOnUse"
//         >
//           <Line
//             x1="0"
//             y1="0"
//             x2="60"
//             y2="60"
//             stroke="#9A433B"
//             strokeWidth="0.8"
//             opacity="0.06"
//           />
//           <Line
//             x1="60"
//             y1="0"
//             x2="0"
//             y2="60"
//             stroke="#9A433B"
//             strokeWidth="0.8"
//             opacity="0.06"
//           />
//         </Pattern>

//         <Pattern
//           id="zigzagPattern"
//           x="0"
//           y="0"
//           width="40"
//           height="40"
//           patternUnits="userSpaceOnUse"
//         >
//           <Line
//             x1="0"
//             y1="20"
//             x2="10"
//             y2="10"
//             stroke="#9A433B"
//             strokeWidth="0.5"
//             opacity="0.08"
//           />
//           <Line
//             x1="10"
//             y1="10"
//             x2="20"
//             y2="20"
//             stroke="#9A433B"
//             strokeWidth="0.5"
//             opacity="0.08"
//           />
//           <Line
//             x1="20"
//             y1="20"
//             x2="30"
//             y2="10"
//             stroke="#9A433B"
//             strokeWidth="0.5"
//             opacity="0.08"
//           />
//           <Line
//             x1="30"
//             y1="10"
//             x2="40"
//             y2="20"
//             stroke="#9A433B"
//             strokeWidth="0.5"
//             opacity="0.08"
//           />
//         </Pattern>
//       </Defs>

//       <Rect
//         x="0"
//         y="0"
//         width={width}
//         height={height}
//         fill="url(#cardGradient)"
//         rx="24"
//       />

//       <Rect
//         x="0"
//         y="0"
//         width={width}
//         height={height}
//         fill="url(#dotPattern)"
//         rx="24"
//       />
//       <Rect
//         x="0"
//         y="0"
//         width={width}
//         height={height}
//         fill="url(#linePattern)"
//         rx="24"
//       />
//       <Rect
//         x="0"
//         y="0"
//         width={width}
//         height={height}
//         fill="url(#zigzagPattern)"
//         rx="24"
//       />

//       {/* Decorative Circles */}
//       <Circle
//         cx={width - 20}
//         cy="40"
//         r="45"
//         fill="none"
//         stroke="#9A433B"
//         strokeWidth="1"
//         opacity="0.08"
//       />
//       <Circle
//         cx={width - 20}
//         cy="40"
//         r="30"
//         fill="none"
//         stroke="#9A433B"
//         strokeWidth="1"
//         opacity="0.08"
//       />
//       <Circle
//         cx={width - 20}
//         cy="40"
//         r="15"
//         fill="none"
//         stroke="#9A433B"
//         strokeWidth="1"
//         opacity="0.08"
//       />

//       <Circle
//         cx="20"
//         cy={height - 30}
//         r="60"
//         fill="none"
//         stroke="#9A433B"
//         strokeWidth="1"
//         opacity="0.06"
//       />
//       <Circle
//         cx="20"
//         cy={height - 30}
//         r="40"
//         fill="none"
//         stroke="#9A433B"
//         strokeWidth="1"
//         opacity="0.06"
//       />
//       <Circle
//         cx="20"
//         cy={height - 30}
//         r="20"
//         fill="none"
//         stroke="#9A433B"
//         strokeWidth="1"
//         opacity="0.06"
//       />

//       <Circle
//         cx={width / 2}
//         cy="30"
//         r="25"
//         fill="none"
//         stroke="#9A433B"
//         strokeWidth="1"
//         opacity="0.05"
//       />

//       <Path
//         d={`M 0 ${height} L 80 ${height} L 0 ${height - 70} Z`}
//         fill="#9A433B"
//         opacity="0.04"
//       />
//       <Path
//         d={`M ${width} 0 L ${width - 80} 0 L ${width} 70 Z`}
//         fill="#9A433B"
//         opacity="0.04"
//       />
//     </Svg>
//   );

//   const renderTaskItem = ({ item }: { item: Task }) => (
//     <View style={[styles.taskItem, item.completed && styles.taskItemCompleted]}>
//       <Pressable
//         style={styles.checkbox}
//         onPress={() => toggleComplete(item.id)}
//       >
//         {item.completed && <Check size={16} color="#fff" />}
//       </Pressable>
//       <View style={styles.taskContent}>
//         <ThemedText
//           style={[styles.taskName, item.completed && styles.taskNameCompleted]}
//         >
//           {item.name}
//         </ThemedText>
//         <View style={styles.taskStats}>
//           <ThemedText style={styles.taskStatsText}>
//             {item.pomodorosCompleted} pomodoros
//           </ThemedText>
//         </View>
//       </View>
//       <View style={styles.taskActions}>
//         {!item.completed && (
//           <Pressable
//             style={styles.editButton}
//             onPress={() => openEditModal(item)}
//           >
//             <Edit2 size={18} color="#666" />
//           </Pressable>
//         )}
//         <Pressable
//           style={styles.deleteButton}
//           onPress={() => deleteTask(item.id)}
//         >
//           <Trash2 size={18} color="#E67E73" />
//         </Pressable>
//       </View>
//     </View>
//   );

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* Current Session Card - Unified Component */}
//       <View
//         style={styles.sessionCardWrapper}
//         onLayout={(event) => {
//           const { width, height } = event.nativeEvent.layout;
//           setCardDimensions({ width, height });
//         }}
//       >
//         {cardDimensions.width > 0 && cardDimensions.height > 0 && (
//           <View style={StyleSheet.absoluteFill}>
//             <SessionCardBackground
//               width={cardDimensions.width}
//               height={cardDimensions.height}
//             />
//           </View>
//         )}

//         <View style={styles.cardContent}>
//           <View style={styles.cardHeader}>
//             <View>
//               <ThemedText style={styles.currentSessionTitle}>
//                 Current Session
//               </ThemedText>
//               <ThemedText style={styles.dailyFlowSubtitle}>
//                 Daily Flow
//               </ThemedText>
//             </View>
//           </View>

//           <View style={styles.dateContainer}>
//             <ThemedText style={styles.dateText}>{currentDate}</ThemedText>
//           </View>

//           <View style={styles.focusCard}>
//             <ThemedText style={styles.focusLabel}>Today's Focus</ThemedText>
//             <ThemedText style={styles.focusTime}>
//               {todayTime.hours > 0 || todayTime.minutes > 0
//                 ? formattedTodayTime
//                 : "No time tracked yet"}
//             </ThemedText>
//           </View>
//         </View>
//       </View>

//       {/* Task Section */}
//       <View style={styles.taskSection}>
//         <View style={styles.taskSectionHeader}>
//           <ThemedText style={styles.taskSectionTitle}>Your Tasks</ThemedText>
//           <Pressable
//             onPress={() => setModalVisible(true)}
//             style={styles.addTaskButton}
//           >
//             <Plus size={20} color="#9A433B" />
//           </Pressable>
//         </View>

//         <View style={styles.tabSelector}>
//           <Pressable
//             style={[styles.tab, !showCompleted && styles.tabActive]}
//             onPress={() => setShowCompleted(false)}
//           >
//             <ThemedText
//               style={[styles.tabText, !showCompleted && styles.tabTextActive]}
//             >
//               Active ({activeTasks.length})
//             </ThemedText>
//           </Pressable>
//           <Pressable
//             style={[styles.tab, showCompleted && styles.tabActive]}
//             onPress={() => setShowCompleted(true)}
//           >
//             <ThemedText
//               style={[styles.tabText, showCompleted && styles.tabTextActive]}
//             >
//               Completed ({completedTasks.length})
//             </ThemedText>
//           </Pressable>
//         </View>

//         <FlatList
//           data={displayedTasks}
//           keyExtractor={(item) => item.id}
//           renderItem={renderTaskItem}
//           scrollEnabled={false}
//           ListEmptyComponent={
//             <View style={styles.emptyState}>
//               <Archive size={48} color="#ccc" />
//               <ThemedText style={styles.emptyStateText}>
//                 {showCompleted
//                   ? "No completed tasks yet"
//                   : "No active tasks. Add your first task!"}
//               </ThemedText>
//             </View>
//           }
//         />

//         {showCompleted && completedTasks.length > 0 && (
//           <Pressable style={styles.clearButton} onPress={clearCompleted}>
//             <Trash2 size={20} color="#E67E73" />
//             <ThemedText style={styles.clearButtonText}>Clear All</ThemedText>
//           </Pressable>
//         )}
//       </View>

//       {/* Add Task Modal */}
//       <Modal visible={modalVisible} animationType="slide" transparent>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <ThemedText style={styles.modalTitle}>Add New Task</ThemedText>
//               <Pressable onPress={() => setModalVisible(false)}>
//                 <X size={24} color="#666" />
//               </Pressable>
//             </View>
//             <TextInput
//               style={styles.input}
//               placeholder="What do you want to accomplish?"
//               placeholderTextColor="#999"
//               value={newTaskName}
//               onChangeText={setNewTaskName}
//               autoFocus
//               onSubmitEditing={addTask}
//             />
//             <View style={styles.modalButtons}>
//               <Pressable
//                 style={[styles.modalButton, styles.cancelButton]}
//                 onPress={() => {
//                   setModalVisible(false);
//                   setNewTaskName("");
//                 }}
//               >
//                 <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
//               </Pressable>
//               <Pressable
//                 style={[styles.modalButton, styles.createButton]}
//                 onPress={addTask}
//               >
//                 <ThemedText style={styles.createButtonText}>
//                   Add Task
//                 </ThemedText>
//               </Pressable>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Edit Task Modal */}
//       <Modal visible={editModalVisible} animationType="slide" transparent>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <ThemedText style={styles.modalTitle}>Edit Task</ThemedText>
//               <Pressable onPress={() => setEditModalVisible(false)}>
//                 <X size={24} color="#666" />
//               </Pressable>
//             </View>
//             <TextInput
//               style={styles.input}
//               placeholder="Task name"
//               placeholderTextColor="#999"
//               value={newTaskName}
//               onChangeText={setNewTaskName}
//               autoFocus
//               onSubmitEditing={handleEditTask}
//             />
//             <View style={styles.modalButtons}>
//               <Pressable
//                 style={[styles.modalButton, styles.cancelButton]}
//                 onPress={() => {
//                   setEditModalVisible(false);
//                   setEditingTask(null);
//                   setNewTaskName("");
//                 }}
//               >
//                 <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
//               </Pressable>
//               <Pressable
//                 style={[styles.modalButton, styles.createButton]}
//                 onPress={handleEditTask}
//               >
//                 <ThemedText style={styles.createButtonText}>Save</ThemedText>
//               </Pressable>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F5F5F3",
//   },
//   sessionCardWrapper: {
//     margin: 20,
//     marginTop: 20,
//     marginBottom: 0,
//     borderRadius: 24,
//     shadowColor: "#9A433B",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 16,
//     elevation: 6,
//     overflow: "hidden",
//     position: "relative",
//     minHeight: 200,
//   },
//   cardContent: {
//     padding: 20,
//     zIndex: 1,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//   },
//   currentSessionTitle: {
//     fontSize: 20,
//     fontWeight: "600",
//     color: "#7C2C26",
//     marginBottom: 4,
//   },
//   dailyFlowSubtitle: {
//     fontSize: 40,
//     color: "#333",
//     fontWeight: "500",
//     lineHeight: 60,
//   },
//   dateContainer: {
//     marginBottom: 16,
//     marginTop: 8,
//   },
//   dateText: {
//     fontSize: 14,
//     color: "#666",
//   },
//   focusCard: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 24,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   focusLabel: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 8,
//     fontWeight: "500",
//   },
//   focusTime: {
//     fontSize: 36,
//     fontWeight: "700",
//     color: "#9A433B",
//   },
//   taskSection: {
//     flex: 1,
//     paddingHorizontal: 20,
//     paddingBottom: 24,
//   },
//   taskSectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//     marginTop: 24,
//   },
//   taskSectionTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#333",
//   },
//   addTaskButton: {
//     padding: 8,
//   },
//   tabSelector: {
//     flexDirection: "row",
//     gap: 12,
//     marginBottom: 16,
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 10,
//     alignItems: "center",
//     borderRadius: 12,
//     backgroundColor: "#fff",
//   },
//   tabActive: {
//     backgroundColor: "#9A433B",
//   },
//   tabText: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#666",
//   },
//   tabTextActive: {
//     color: "#fff",
//   },
//   taskItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 12,
//   },
//   taskItemCompleted: {
//     opacity: 0.6,
//     backgroundColor: "#f9f9f9",
//   },
//   checkbox: {
//     width: 24,
//     height: 24,
//     borderRadius: 6,
//     borderWidth: 2,
//     borderColor: "#9A433B",
//     marginRight: 12,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   taskContent: {
//     flex: 1,
//   },
//   taskName: {
//     fontSize: 16,
//     fontWeight: "500",
//     marginBottom: 4,
//   },
//   taskNameCompleted: {
//     textDecorationLine: "line-through",
//     color: "#999",
//   },
//   taskStats: {
//     flexDirection: "row",
//     gap: 12,
//   },
//   taskStatsText: {
//     fontSize: 11,
//     color: "#999",
//   },
//   taskActions: {
//     flexDirection: "row",
//     gap: 12,
//   },
//   editButton: {
//     padding: 4,
//   },
//   deleteButton: {
//     padding: 4,
//   },
//   emptyState: {
//     alignItems: "center",
//     padding: 40,
//     gap: 12,
//   },
//   emptyStateText: {
//     fontSize: 14,
//     color: "#999",
//     textAlign: "center",
//   },
//   clearButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//     backgroundColor: "#fff",
//     marginTop: 16,
//     paddingVertical: 12,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#E67E73",
//   },
//   clearButtonText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#E67E73",
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     padding: 24,
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     borderRadius: 24,
//     padding: 24,
//     gap: 20,
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "600",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 12,
//     padding: 14,
//     fontSize: 16,
//   },
//   modalButtons: {
//     flexDirection: "row",
//     gap: 12,
//   },
//   modalButton: {
//     flex: 1,
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   cancelButton: {
//     backgroundColor: "#f0f0f0",
//   },
//   cancelButtonText: {
//     color: "#666",
//     fontWeight: "600",
//   },
//   createButton: {
//     backgroundColor: "#9A433B",
//   },
//   createButtonText: {
//     color: "#fff",
//     fontWeight: "600",
//   },
// });

// app/(tabs)/task.tsx

import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  Modal,
  Pressable,
  Alert,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Task, getActiveTasks, getCompletedTasks } from "@/types";
import { Plus, Edit2, Trash2, Check, X, Archive } from "lucide-react-native";
import Svg, {
  Circle,
  Line,
  G,
  Defs,
  Pattern,
  Rect,
  LinearGradient,
  Stop,
  Path,
} from "react-native-svg";
import { useTimer } from "@/components/context/timerContext";

export default function TaskScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [cardDimensions, setCardDimensions] = useState({ width: 0, height: 0 });

  const { formattedTodayTime, todayTime } = useTimer();

  const activeTasks = getActiveTasks(tasks);
  const completedTasks = getCompletedTasks(tasks);
  const displayedTasks = showCompleted ? completedTasks : activeTasks;

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);

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
      pomodorosCompleted: 0,
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
          ? { ...task, name: newTaskName.trim(), updatedAt: new Date() }
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
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setNewTaskName(task.name);
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

  const SessionCardBackground = ({
    width,
    height,
  }: {
    width: number;
    height: number;
  }) => (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Defs>
        <LinearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="50%" stopColor="#FDF8F7" />
          <Stop offset="100%" stopColor="#FDF5F3" />
        </LinearGradient>

        <Pattern
          id="dotPattern"
          x="0"
          y="0"
          width="30"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <Circle cx="15" cy="15" r="1.5" fill="#9A433B" opacity="0.12" />
        </Pattern>

        <Pattern
          id="linePattern"
          x="0"
          y="0"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <Line
            x1="0"
            y1="0"
            x2="60"
            y2="60"
            stroke="#9A433B"
            strokeWidth="0.8"
            opacity="0.06"
          />
          <Line
            x1="60"
            y1="0"
            x2="0"
            y2="60"
            stroke="#9A433B"
            strokeWidth="0.8"
            opacity="0.06"
          />
        </Pattern>

        <Pattern
          id="zigzagPattern"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <Line
            x1="0"
            y1="20"
            x2="10"
            y2="10"
            stroke="#9A433B"
            strokeWidth="0.5"
            opacity="0.08"
          />
          <Line
            x1="10"
            y1="10"
            x2="20"
            y2="20"
            stroke="#9A433B"
            strokeWidth="0.5"
            opacity="0.08"
          />
          <Line
            x1="20"
            y1="20"
            x2="30"
            y2="10"
            stroke="#9A433B"
            strokeWidth="0.5"
            opacity="0.08"
          />
          <Line
            x1="30"
            y1="10"
            x2="40"
            y2="20"
            stroke="#9A433B"
            strokeWidth="0.5"
            opacity="0.08"
          />
        </Pattern>
      </Defs>

      <Rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="url(#cardGradient)"
        rx="24"
      />

      <Rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="url(#dotPattern)"
        rx="24"
      />
      <Rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="url(#linePattern)"
        rx="24"
      />
      <Rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="url(#zigzagPattern)"
        rx="24"
      />

      <Circle
        cx={width - 20}
        cy="40"
        r="45"
        fill="none"
        stroke="#9A433B"
        strokeWidth="1"
        opacity="0.08"
      />
      <Circle
        cx={width - 20}
        cy="40"
        r="30"
        fill="none"
        stroke="#9A433B"
        strokeWidth="1"
        opacity="0.08"
      />
      <Circle
        cx={width - 20}
        cy="40"
        r="15"
        fill="none"
        stroke="#9A433B"
        strokeWidth="1"
        opacity="0.08"
      />

      <Circle
        cx="20"
        cy={height - 30}
        r="60"
        fill="none"
        stroke="#9A433B"
        strokeWidth="1"
        opacity="0.06"
      />
      <Circle
        cx="20"
        cy={height - 30}
        r="40"
        fill="none"
        stroke="#9A433B"
        strokeWidth="1"
        opacity="0.06"
      />
      <Circle
        cx="20"
        cy={height - 30}
        r="20"
        fill="none"
        stroke="#9A433B"
        strokeWidth="1"
        opacity="0.06"
      />

      <Circle
        cx={width / 2}
        cy="30"
        r="25"
        fill="none"
        stroke="#9A433B"
        strokeWidth="1"
        opacity="0.05"
      />

      <Path
        d={`M 0 ${height} L 80 ${height} L 0 ${height - 70} Z`}
        fill="#9A433B"
        opacity="0.04"
      />
      <Path
        d={`M ${width} 0 L ${width - 80} 0 L ${width} 70 Z`}
        fill="#9A433B"
        opacity="0.04"
      />
    </Svg>
  );

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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View
        style={styles.sessionCardWrapper}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setCardDimensions({ width, height });
        }}
      >
        {cardDimensions.width > 0 && cardDimensions.height > 0 && (
          <View style={StyleSheet.absoluteFill}>
            <SessionCardBackground
              width={cardDimensions.width}
              height={cardDimensions.height}
            />
          </View>
        )}

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View>
              <ThemedText style={styles.currentSessionTitle}>
                Current Session
              </ThemedText>
              <ThemedText style={styles.dailyFlowSubtitle}>
                Daily Flow
              </ThemedText>
            </View>
          </View>

          <View style={styles.dateContainer}>
            <ThemedText style={styles.dateText}>{currentDate}</ThemedText>
          </View>

          <View style={styles.focusCard}>
            <ThemedText style={styles.focusLabel}>Today's Focus</ThemedText>
            <ThemedText style={styles.focusTime}>
              {todayTime.hours > 0 || todayTime.minutes > 0
                ? formattedTodayTime
                : "No time tracked yet"}
            </ThemedText>
          </View>
        </View>
      </View>

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
      </View>

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
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setNewTaskName("");
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
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setEditModalVisible(false);
                  setEditingTask(null);
                  setNewTaskName("");
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
  sessionCardWrapper: {
    margin: 20,
    marginTop: 20,
    marginBottom: 0,
    borderRadius: 24,
    shadowColor: "#9A433B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    overflow: "hidden",
    position: "relative",
    minHeight: 200,
  },
  cardContent: {
    padding: 20,
    zIndex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  currentSessionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#7C2C26",
    marginBottom: 4,
  },
  dailyFlowSubtitle: {
    fontSize: 40,
    color: "#333",
    fontWeight: "500",
    lineHeight: 60,
  },
  dateContainer: {
    marginBottom: 16,
    marginTop: 8,
  },
  dateText: {
    fontSize: 14,
    color: "#666",
  },
  focusCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  focusLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },
  focusTime: {
    fontSize: 36,
    fontWeight: "700",
    color: "#9A433B",
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
    gap: 12,
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

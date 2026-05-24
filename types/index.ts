// types/index.ts

export type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

export interface TimerConfig {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
}

export interface TimerSession {
  startTime: number;
  date: string;
  duration: number;
  mode: TimerMode;
}

export interface Task {
  id: string;
  name: string;
  completed: boolean;
  createdAt: Date;
  pomodorosCompleted: number;
  updatedAt?: Date;
  timerDuration?: number;
}

export interface AlarmSettings {
  enabled: boolean;
  sound: string;
  vibration: boolean;
}

export interface DailyStats {
  date: string;
  totalSeconds: number;
  completedPomodoros: number;
  sessions: number;
}

export interface WeeklyStats {
  days: DailyStats[];
  currentStreak: number;
  longestStreak: number;
}

export type TaskAction =
  | { type: "ADD_TASK"; payload: Task }
  | { type: "EDIT_TASK"; payload: { id: string; updates: Partial<Task> } }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "COMPLETE_TASK"; payload: string }
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "REORDER_TASKS"; payload: Task[] };

// Helper types for component props
export type TimerScreenProps = {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onModeChange: (mode: TimerMode) => void;
};

export type TaskScreenProps = {
  tasks: Task[];
  onAddTask: (name: string, duration: number) => void;
  onEditTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onCompleteTask: (id: string) => void;
  onSelectTask: (task: Task) => void;
  selectedTaskId?: string;
};

export type StatsScreenProps = {
  tasks: Task[];
  totalFocusTime: number; // in minutes
  completedPomodoros: number;
  currentStreak: number;
  longestStreak: number;
};

export type SettingsScreenProps = {
  timerConfig: TimerConfig;
  alarmSettings: AlarmSettings;
  onUpdateTimerConfig: (config: Partial<TimerConfig>) => void;
  onUpdateAlarmSettings: (settings: Partial<AlarmSettings>) => void;
  onSignOut: () => void;
};

// Default values
export const DEFAULT_TIMER_CONFIG: TimerConfig = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
};

export const DEFAULT_ALARM_SETTINGS: AlarmSettings = {
  enabled: true,
  sound: "default",
  vibration: true,
};

//Timer Spent in a Day.
export const getTodayTimeSpent = (
  sessions: TimerSession[],
): { hours: number; minutes: number } => {
  const today = new Date().toISOString().split("T")[0];

  const totalSeconds = sessions
    .filter((session) => session.date === today)
    .reduce((total, session) => total + session.duration, 0);

  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
  };
};

export const formatTimeSpent = (hours: number, minutes: number): string => {
  if (hours === 0 && minutes === 0) return "0m";

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.join(" ");
};

// Helper functions
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

export const calculateTotalFocusTime = (tasks: Task[]): number => {
  return tasks.reduce((total, task) => {
    return total + task.pomodorosCompleted * task.timerDuration;
  }, 0);
};

export const calculateCompletedPomodoros = (tasks: Task[]): number => {
  return tasks.reduce((total, task) => {
    return total + task.pomodorosCompleted;
  }, 0);
};

export const getActiveTasks = (tasks: Task[]): Task[] => {
  return tasks.filter((task) => !task.completed);
};

export const getCompletedTasks = (tasks: Task[]): Task[] => {
  return tasks.filter((task) => task.completed);
};

// Utility functions for task management
export const createNewTask = (name: string, timerDuration: number): Task => {
  return {
    id: Date.now().toString(),
    name,
    timerDuration,
    completed: false,
    createdAt: new Date(),
    pomodorosCompleted: 0,
  };
};

export const updateTaskPomodoros = (task: Task): Task => {
  return {
    ...task,
    pomodorosCompleted: task.pomodorosCompleted + 1,
    updatedAt: new Date(),
  };
};

export const getTimeForMode = (
  mode: TimerMode,
  config: TimerConfig,
): number => {
  switch (mode) {
    case "pomodoro":
      return config.pomodoro * 60;
    case "shortBreak":
      return config.shortBreak * 60;
    case "longBreak":
      return config.longBreak * 60;
  }
};

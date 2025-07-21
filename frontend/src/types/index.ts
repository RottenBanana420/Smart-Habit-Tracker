export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  frequency: "daily" | "weekly" | "monthly";
  target_count: number;
  created_at: string;
  updated_at: string;
}

export interface HabitEntry {
  id: number;
  habit_id: number;
  completed_at: string;
  notes?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

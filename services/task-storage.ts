import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Task } from "@/types/task";

const KEY = "tasks";

export async function getStoredTasks(): Promise<Task[]> {
  const data = await AsyncStorage.getItem(KEY);
  return data ? (JSON.parse(data) as Task[]) : [];
}

export async function saveTasks(tasks: Task[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(tasks));
}

import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { getStoredTasks, saveTasks } from "@/services/task-storage";
import type { Task } from "@/types/task";

export default function NewTaskScreen() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const isValid = useMemo(
    () => title.trim().length >= 3 && description.trim().length >= 5,
    [title, description],
  );

  const handleCreate = async () => {
    if (!isValid) {
      Alert.alert(
        "Validation",
        "Please enter a title (minimum 3 characters) and description (minimum 5 characters).",
      );
      return;
    }

    const existingTasks = await getStoredTasks();

    const task: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await saveTasks([task, ...existingTasks]);

    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >
          <View style={styles.header}>
            <Text style={styles.title}>New Task</Text>
            <Text style={styles.subtitle}>
              Stay organized by creating a new task.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Title</Text>

            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              autoCapitalize="sentences"
              returnKeyType="next"
            />

            <Text style={styles.label}>Description</Text>

            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Enter task description"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              style={[styles.input, styles.textArea]}
            />
          </View>

          <Pressable
            disabled={!isValid}
            onPress={handleCreate}
            style={({ pressed }) => [
              styles.button,
              !isValid && styles.buttonDisabled,
              pressed && isValid && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Create Task</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  container: {
    padding: 20,
    gap: 24,
    flexGrow: 1,
  },

  header: {
    gap: 6,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#0f172a",
  },

  subtitle: {
    fontSize: 16,
    color: "#64748b",
  },

  form: {
    gap: 12,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dbe4ee",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#0f172a",
  },

  textArea: {
    minHeight: 140,
  },

  button: {
    marginTop: 10,
    backgroundColor: "#4f46e5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonPressed: {
    opacity: 0.85,
  },

  buttonDisabled: {
    backgroundColor: "#c7d2fe",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

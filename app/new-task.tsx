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

const TITLE_MIN_LENGTH = 3;
const TITLE_MAX_LENGTH = 50;
const DESCRIPTION_MIN_LENGTH = 5;
const DESCRIPTION_MAX_LENGTH = 300;

const getTitleError = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "Title is required.";
  }

  if (trimmedValue.length < TITLE_MIN_LENGTH) {
    return `Title must be at least ${TITLE_MIN_LENGTH} characters.`;
  }

  if (trimmedValue.length > TITLE_MAX_LENGTH) {
    return `Title must be no more than ${TITLE_MAX_LENGTH} characters.`;
  }

  return "";
};

const getDescriptionError = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "Description is required.";
  }

  if (trimmedValue.length < DESCRIPTION_MIN_LENGTH) {
    return `Description must be at least ${DESCRIPTION_MIN_LENGTH} characters.`;
  }

  if (trimmedValue.length > DESCRIPTION_MAX_LENGTH) {
    return `Description must be no more than ${DESCRIPTION_MAX_LENGTH} characters.`;
  }

  return "";
};

export default function NewTaskScreen() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleTouched, setTitleTouched] = useState(false);
  const [descriptionTouched, setDescriptionTouched] = useState(false);

  const titleError = useMemo(() => getTitleError(title), [title]);
  const descriptionError = useMemo(
    () => getDescriptionError(description),
    [description],
  );

  const isValid = !titleError && !descriptionError;

  const handleCreate = async () => {
    const titleValue = title.trim();
    const descriptionValue = description.trim();
    const nextTitleError = getTitleError(titleValue);
    const nextDescriptionError = getDescriptionError(descriptionValue);

    setTitleTouched(true);
    setDescriptionTouched(true);

    if (nextTitleError || nextDescriptionError) {
      Alert.alert(
        "Validation",
        [nextTitleError, nextDescriptionError].filter(Boolean).join("\n"),
      );
      return;
    }

    const existingTasks = await getStoredTasks();

    const task: Task = {
      id: Date.now().toString(),
      title: titleValue,
      description: descriptionValue,
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
              onChangeText={(value) => {
                setTitle(value);
                if (!titleTouched) {
                  setTitleTouched(true);
                }
              }}
              onBlur={() => setTitleTouched(true)}
              placeholder="Enter task title"
              placeholderTextColor="#94a3b8"
              style={[
                styles.input,
                titleTouched && titleError ? styles.inputError : null,
              ]}
              autoCapitalize="sentences"
              maxLength={TITLE_MAX_LENGTH}
              returnKeyType="next"
            />
            {titleTouched && titleError ? (
              <Text style={styles.errorText}>{titleError}</Text>
            ) : null}

            <Text style={styles.label}>Description</Text>

            <TextInput
              value={description}
              onChangeText={(value) => {
                setDescription(value);
                if (!descriptionTouched) {
                  setDescriptionTouched(true);
                }
              }}
              onBlur={() => setDescriptionTouched(true)}
              placeholder="Enter task description"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              style={[
                styles.input,
                styles.textArea,
                descriptionTouched && descriptionError
                  ? styles.inputError
                  : null,
              ]}
              maxLength={DESCRIPTION_MAX_LENGTH}
            />
            {descriptionTouched && descriptionError ? (
              <Text style={styles.errorText}>{descriptionError}</Text>
            ) : null}
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

  inputError: {
    borderColor: "#dc2626",
  },

  errorText: {
    color: "#dc2626",
    fontSize: 13,
    marginTop: -4,
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

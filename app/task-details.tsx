import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { theme } from "@/constants/theme";
import type { Task } from "@/types/task";
import moment from "moment";

export default function TaskDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ task?: string }>();
  const task = params.task ? (JSON.parse(params.task) as Task) : null;

  if (!task) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyState}>
          <Text style={styles.title}>Task not found</Text>
          <AppButton title="Go back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <AppCard style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{task.title}</Text>
            <StatusBadge status={task.status} />
          </View>

          <SectionHeader
            title="Description"
            subtitle="The task details you captured"
          />
          <Text style={styles.description}>
            {task.description || "No description provided."}
          </Text>

          <SectionHeader title="Created" subtitle="When this task was added" />
          <Text style={styles.meta}>
            {moment(task.createdAt).format("DD/MM/YYYY HH:mm A")}
          </Text>
        </AppCard>

        <AppButton title="Back to tasks" onPress={() => router.back()} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surfaceElevated,
  },
  container: {
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  card: {
    gap: theme.spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
    flex: 1,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.textSecondary,
  },
  meta: {
    fontSize: 15,
    color: theme.colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
    gap: 12,
  },
});

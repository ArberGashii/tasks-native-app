import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/constants/theme";
import type { TaskStatus } from "@/types/task";

type StatusBadgeProps = {
  status: TaskStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const isCompleted = status === "completed";

  return (
    <View
      style={[styles.badge, isCompleted ? styles.completed : styles.pending]}
    >
      <Text
        style={[
          styles.text,
          isCompleted ? styles.completedText : styles.pendingText,
        ]}
      >
        {isCompleted ? "Done" : "Pending"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  completed: {
    backgroundColor: theme.colors.successSoft,
  },
  pending: {
    backgroundColor: theme.colors.warningSoft,
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
  },
  completedText: {
    color: theme.colors.success,
  },
  pendingText: {
    color: theme.colors.warning,
  },
});

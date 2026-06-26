import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppCard } from "@/components/ui/AppCard";
import { AppTextInput } from "@/components/ui/AppTextInput";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { theme } from "@/constants/theme";
import { getStoredTasks, saveTasks } from "@/services/task-storage";
import type { Task, TaskStatus } from "@/types/task";
import { getWeatherDescription } from "@/utils/getWeatherDescription";
import moment from "moment";

const sortTasksByDate = (items: Task[]) => {
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [dateFilter, setDateFilter] = useState<
    "all" | "today" | "week" | "month"
  >("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [weather, setWeather] = useState<{
    city: string;
    temp: string;
    description: string;
  } | null>(null);

  const loadTasks = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }

    const storedTasks = await getStoredTasks();
    setTasks(storedTasks);

    if (showLoading) {
      setLoading(false);
    }
  }, []);

  const loadWeather = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=42.6629&longitude=21.1655&current=temperature_2m,weather_code&timezone=auto",
      );

      const data = await response.json();

      setWeather({
        city: "Pristina",
        temp: `${Math.round(data.current.temperature_2m)}°C`,
        description: getWeatherDescription(data.current.weather_code),
      });
    } catch {
      setWeather({
        city: "Pristina",
        temp: "--",
        description: "Weather unavailable",
      });
    }
  }, []);

  const refreshData = useCallback(async () => {
    setRefreshing(true);

    await new Promise((resolve) => setTimeout(resolve, 900));
    await Promise.all([loadTasks(false), loadWeather()]);

    setRefreshing(false);
  }, [loadTasks, loadWeather]);

  useFocusEffect(
    useCallback(() => {
      void loadTasks();
    }, [loadTasks]),
  );

  useEffect(() => {
    void loadTasks();
    void loadWeather();
  }, [loadTasks, loadWeather]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesFilter = filter === "all" || task.status === filter;

      const taskDate = moment(task.createdAt);
      const now = moment();
      const isToday = taskDate.isSame(now, "day");
      const isThisWeek = taskDate.isSameOrAfter(
        now.clone().subtract(7, "days"),
      );
      const isThisMonth = taskDate.isSame(now, "month");

      const matchesDate =
        dateFilter === "all" ||
        (dateFilter === "today" && isToday) ||
        (dateFilter === "week" && isThisWeek) ||
        (dateFilter === "month" && isThisMonth);

      return matchesSearch && matchesFilter && matchesDate;
    });
  }, [dateFilter, filter, search, tasks]);

  const sortedTasks = useMemo(() => {
    return sortTasksByDate(filteredTasks);
  }, [filteredTasks]);

  const visibleTaskCount = filteredTasks.length;
  const visibleCompletedCount = filteredTasks.filter(
    (task) => task.status === "completed",
  ).length;

  const handleToggleStatus = async (taskId: string) => {
    const updatedTasks: Task[] = tasks.map((task) => {
      if (task.id !== taskId) {
        return task;
      }

      const nextStatus: TaskStatus =
        task.status === "completed" ? "pending" : "completed";
      return { ...task, status: nextStatus };
    });
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  const handleDelete = (taskId: string) => {
    Alert.alert("Delete task", "Remove this task from your list?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updatedTasks = tasks.filter((task) => task.id !== taskId);
          setTasks(updatedTasks);
          await saveTasks(updatedTasks);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void refreshData()}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerTextBlock}>
            <Text style={styles.eyebrow}>Productivity</Text>
            <Text style={styles.title}>Today’s tasks</Text>
          </View>
          <Pressable
            onPress={() => router.push("/new-task")}
            style={styles.addButton}
          >
            <Ionicons name="add" size={22} color={theme.colors.textInverse} />
          </Pressable>
        </View>

        <AppCard style={styles.weatherCard}>
          <View style={styles.weatherRow}>
            <View style={styles.weatherInfo}>
              <Text style={styles.cardLabel}>Weather</Text>
              <Text style={styles.cardTitle}>
                {weather?.city ?? "Pristina"}
              </Text>
              <Text style={styles.cardTemp}>
                {weather?.temp ?? "Loading..."}
              </Text>
              <Text style={styles.cardSubtext}>
                {weather?.description ?? "Fetching weather..."}
              </Text>
            </View>
            <View style={styles.weatherIconWrap}>
              <Ionicons
                name="partly-sunny-outline"
                size={28}
                color={theme.colors.primary}
              />
            </View>
          </View>
        </AppCard>

        <View style={styles.summaryRow}>
          <AppCard style={styles.summaryBox}>
            <Text style={styles.summaryValue}>{visibleTaskCount}</Text>
            <Text style={styles.summaryLabel}>All tasks</Text>
          </AppCard>
          <AppCard style={styles.summaryBox}>
            <Text style={styles.summaryValue}>{visibleCompletedCount}</Text>
            <Text style={styles.summaryLabel}>Completed</Text>
          </AppCard>
        </View>

        <AppTextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search by title"
        />

        <SectionHeader title="Filters" subtitle="Refine what you want to see" />

        <View style={styles.filterRow}>
          {(["all", "pending", "completed"] as const).map((option) => (
            <Pressable
              key={option}
              onPress={() => setFilter(option)}
              style={[
                styles.filterChip,
                filter === option && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === option && styles.filterTextActive,
                ]}
              >
                {option === "all"
                  ? "All"
                  : option === "pending"
                    ? "Pending"
                    : "Completed"}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.filterRow}>
          {(["all", "today", "week", "month"] as const).map((option) => (
            <Pressable
              key={option}
              onPress={() => setDateFilter(option)}
              style={[
                styles.filterChip,
                dateFilter === option && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  dateFilter === option && styles.filterTextActive,
                ]}
              >
                {option === "all"
                  ? "All dates"
                  : option === "today"
                    ? "Today"
                    : option === "week"
                      ? "This week"
                      : "This month"}
              </Text>
            </Pressable>
          ))}
        </View>

        {loading ? (
          <AppCard style={styles.emptyState}>
            <ActivityIndicator color={theme.colors.primary} size="large" />
            <Text style={styles.emptyText}>Loading your tasks...</Text>
          </AppCard>
        ) : sortedTasks.length === 0 ? (
          <AppCard style={styles.emptyState}>
            <Ionicons
              name="clipboard-outline"
              size={36}
              color={theme.colors.textMuted}
            />
            <Text style={styles.emptyText}>No tasks match this view.</Text>
            <Text style={styles.emptySubtext}>Add one to get started.</Text>
          </AppCard>
        ) : (
          sortedTasks.map((task) => (
            <AppCard key={task.id} style={styles.taskItem}>
              <Pressable
                style={styles.taskContent}
                onPress={() =>
                  router.push({
                    pathname: "/task-details",
                    params: { task: JSON.stringify(task) },
                  })
                }
              >
                <View style={styles.taskHeader}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <StatusBadge status={task.status} />
                </View>
                <Text style={styles.taskDescription} numberOfLines={2}>
                  {task.description}
                </Text>
                <Text style={styles.taskMeta}>
                  {moment(task.createdAt).format("DD/MM/YYYY HH:mm A")}
                </Text>
              </Pressable>

              <View style={styles.actionsRow}>
                <Pressable
                  onPress={() => void handleToggleStatus(task.id)}
                  style={styles.iconButton}
                >
                  <Ionicons
                    name={
                      task.status === "completed"
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={22}
                    color={
                      task.status === "completed"
                        ? theme.colors.success
                        : theme.colors.textMuted
                    }
                  />
                </Pressable>
                <Pressable
                  onPress={() => handleDelete(task.id)}
                  style={styles.iconButton}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={theme.colors.danger}
                  />
                </Pressable>
              </View>
            </AppCard>
          ))
        )}
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
    paddingBottom: 40,
    gap: theme.spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTextBlock: {
    flex: 1,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontWeight: "700",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.full,
    padding: theme.spacing.sm,
  },
  weatherCard: {
    paddingVertical: theme.spacing.lg,
  },
  weatherRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  weatherInfo: {
    flex: 1,
  },
  weatherIconWrap: {
    width: 48,
    height: 48,
    borderRadius: theme.radii.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primarySoft,
  },
  cardLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: theme.colors.text,
  },
  cardTemp: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.text,
    marginTop: 2,
  },
  cardSubtext: {
    marginTop: 4,
    color: theme.colors.textSecondary,
    fontSize: 13,
    textTransform: "capitalize",
  },
  summaryRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  summaryBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.text,
  },
  summaryLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  filterChip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  filterTextActive: {
    color: theme.colors.textInverse,
  },
  taskItem: {
    padding: theme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  taskContent: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    flex: 1,
  },
  taskDescription: {
    color: theme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  taskMeta: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 6,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
    gap: 6,
  },
  emptyText: {
    color: theme.colors.text,
    fontWeight: "700",
  },
  emptySubtext: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
});

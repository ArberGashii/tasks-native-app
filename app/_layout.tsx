import { Stack } from "expo-router";
import "react-native-reanimated";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, title: "Home" }}
      />
      <Stack.Screen name="new-task" options={{ title: "New Task" }} />
      <Stack.Screen name="task-details" options={{ title: "Task Details" }} />
    </Stack>
  );
}

import React from "react";
import {
  StyleSheet,
  TextInput,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
} from "react-native";

import { theme } from "@/constants/theme";

type AppTextInputProps = TextInputProps & {
  style?: StyleProp<TextStyle>;
};

export function AppTextInput({ style, ...props }: AppTextInputProps) {
  return (
    <TextInput
      placeholderTextColor={theme.colors.textMuted}
      style={[styles.input, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    color: theme.colors.text,
    fontSize: 15,
  },
});

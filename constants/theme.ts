/**
 * Shared theme primitives for the app.
 */

import { Platform } from "react-native";

const tintColorLight = "#4f46e5";
const tintColorDark = "#fff";

export const theme = {
  colors: {
    primary: "#4f46e5",
    primarySoft: "#eef2ff",
    surface: "#ffffff",
    surfaceElevated: "#f8fafc",
    border: "#e2e8f0",
    text: "#0f172a",
    textSecondary: "#475569",
    textMuted: "#64748b",
    textInverse: "#ffffff",
    success: "#16a34a",
    successSoft: "#dcfce7",
    warning: "#d97706",
    warningSoft: "#fef3c7",
    danger: "#ef4444",
    shadow: "#0f172a",
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 12,
    lg: 16,
    xl: 20,
  },
  radii: {
    md: 12,
    lg: 14,
    xl: 18,
    full: 999,
  },
};

export const Colors = {
  light: {
    text: theme.colors.text,
    background: theme.colors.surfaceElevated,
    tint: tintColorLight,
    icon: theme.colors.textMuted,
    tabIconDefault: theme.colors.textMuted,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

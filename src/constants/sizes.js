import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const sizes = {
  // Ekran boyutları
  screen: {
    width,
    height,
  },

  // Padding ve margin
  padding: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  margin: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border radius
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 999,
  },

  // Buton boyutları
  button: {
    height: {
      sm: 40,
      md: 48,
      lg: 56,
    },
    padding: {
      horizontal: 16,
      vertical: 12,
    },
  },

  // Input boyutları
  input: {
    height: 48,
    padding: 16,
  },

  // Kart boyutları
  card: {
    padding: 16,
    margin: 8,
  },

  // Icon boyutları
  icon: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
    xxl: 48,
  },

  // Header boyutları
  header: {
    height: 60,
    padding: 16,
  },

  // Tab bar boyutları
  tabBar: {
    height: 60,
    padding: 8,
  },
};

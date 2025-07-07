import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";
import { fonts } from "../constants/fonts";
import { sizes } from "../constants/sizes";

export const globalStyles = StyleSheet.create({
  // Container stilları
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    padding: sizes.padding.md,
  },

  // Text stilları
  title: {
    fontSize: fonts.size.title,
    fontFamily: fonts.family.bold,
    color: colors.text,
    marginBottom: sizes.margin.md,
  },

  heading: {
    fontSize: fonts.size.heading,
    fontFamily: fonts.family.semiBold,
    color: colors.text,
    marginBottom: sizes.margin.sm,
  },

  subheading: {
    fontSize: fonts.size.subheading,
    fontFamily: fonts.family.medium,
    color: colors.text,
    marginBottom: sizes.margin.sm,
  },

  body: {
    fontSize: fonts.size.md,
    fontFamily: fonts.family.regular,
    color: colors.text,
    lineHeight: fonts.lineHeight.md,
  },

  caption: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.regular,
    color: colors.textSecondary,
    lineHeight: fonts.lineHeight.sm,
  },

  // Layout stilları
  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  column: {
    flexDirection: "column",
  },

  center: {
    justifyContent: "center",
    alignItems: "center",
  },

  // Card stilları
  card: {
    backgroundColor: colors.surface,
    borderRadius: sizes.radius.md,
    padding: sizes.padding.md,
    marginBottom: sizes.margin.md,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: sizes.margin.sm,
  },

  // Form stilları
  form: {
    padding: sizes.padding.md,
  },

  formGroup: {
    marginBottom: sizes.margin.md,
  },

  label: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.medium,
    color: colors.textSecondary,
    marginBottom: sizes.margin.xs,
  },

  // Button stilları
  button: {
    height: sizes.button.height.md,
    borderRadius: sizes.radius.md,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: sizes.button.padding.horizontal,
  },

  buttonPrimary: {
    backgroundColor: colors.primary,
  },

  buttonSecondary: {
    backgroundColor: colors.secondary,
  },

  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border,
  },

  buttonText: {
    fontSize: fonts.size.md,
    fontFamily: fonts.family.medium,
    color: colors.text,
  },

  // Input stilları
  input: {
    height: sizes.input.height,
    backgroundColor: colors.surface,
    borderRadius: sizes.radius.md,
    paddingHorizontal: sizes.input.padding,
    fontSize: fonts.size.md,
    fontFamily: fonts.family.regular,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },

  inputFocused: {
    borderColor: colors.primary,
  },

  inputError: {
    borderColor: colors.error,
  },

  // List stilları
  list: {
    padding: sizes.padding.md,
  },

  listItem: {
    backgroundColor: colors.surface,
    borderRadius: sizes.radius.md,
    padding: sizes.padding.md,
    marginBottom: sizes.margin.sm,
  },

  // Separator stilları
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: sizes.margin.md,
  },

  // Loading stilları
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },

  // Error stilları
  error: {
    color: colors.error,
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.regular,
    marginTop: sizes.margin.xs,
  },

  // Success stilları
  success: {
    color: colors.success,
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.regular,
    marginTop: sizes.margin.xs,
  },
});

import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import { sizes } from "../../constants/sizes";

const Button = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[`button_${size}`]];

    if (variant === "gradient") {
      return baseStyle;
    }

    return [...baseStyle, styles[`button_${variant}`]];
  };

  const getTextStyle = () => {
    return [
      styles.buttonText,
      styles[`buttonText_${size}`],
      styles[`buttonText_${variant}`],
      textStyle,
    ];
  };

  const isDisabled = disabled || loading;

  const ButtonContent = () => (
    <>
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === "outline" ? colors.primary : colors.text}
          style={styles.loader}
        />
      )}
      {icon && !loading && icon}
      <Text style={getTextStyle()}>{title}</Text>
    </>
  );

  if (variant === "gradient") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={[styles.gradientContainer, style]}
        {...props}
      >
        <LinearGradient
          colors={colors.gradient.primary}
          style={getButtonStyle()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <ButtonContent />
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[getButtonStyle(), style, isDisabled && styles.buttonDisabled]}
      {...props}
    >
      <ButtonContent />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: sizes.radius.md,
    paddingHorizontal: sizes.padding.md,
  },

  // Size variants
  button_sm: {
    height: sizes.button.height.sm,
    paddingHorizontal: sizes.padding.sm,
  },

  button_md: {
    height: sizes.button.height.md,
    paddingHorizontal: sizes.padding.md,
  },

  button_lg: {
    height: sizes.button.height.lg,
    paddingHorizontal: sizes.padding.lg,
  },

  // Color variants
  button_primary: {
    backgroundColor: colors.primary,
  },

  button_secondary: {
    backgroundColor: colors.secondary,
  },

  button_outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
  },

  button_ghost: {
    backgroundColor: "transparent",
  },

  button_danger: {
    backgroundColor: colors.error,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  // Text styles
  buttonText: {
    fontFamily: fonts.family.medium,
    textAlign: "center",
  },

  buttonText_sm: {
    fontSize: fonts.size.sm,
  },

  buttonText_md: {
    fontSize: fonts.size.md,
  },

  buttonText_lg: {
    fontSize: fonts.size.lg,
  },

  buttonText_primary: {
    color: colors.text,
  },

  buttonText_secondary: {
    color: colors.text,
  },

  buttonText_outline: {
    color: colors.primary,
  },

  buttonText_ghost: {
    color: colors.primary,
  },

  buttonText_danger: {
    color: colors.text,
  },

  // Gradient styles
  gradientContainer: {
    borderRadius: sizes.radius.md,
  },

  // Loader
  loader: {
    marginRight: sizes.margin.sm,
  },
});

export default Button;

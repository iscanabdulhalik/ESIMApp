import React, { useState, forwardRef } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import { sizes } from "../../constants/sizes";

const Input = forwardRef(
  (
    {
      label,
      placeholder,
      value,
      onChangeText,
      onBlur,
      onFocus,
      error,
      secureTextEntry,
      keyboardType = "default",
      autoCapitalize = "none",
      autoCorrect = false,
      maxLength,
      multiline = false,
      numberOfLines = 1,
      leftIcon,
      rightIcon,
      showPasswordToggle = false,
      disabled = false,
      style,
      inputStyle,
      containerStyle,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleFocus = (e) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const getInputStyle = () => {
      const baseStyle = [styles.input];

      if (isFocused) {
        baseStyle.push(styles.inputFocused);
      }

      if (error) {
        baseStyle.push(styles.inputError);
      }

      if (disabled) {
        baseStyle.push(styles.inputDisabled);
      }

      if (leftIcon) {
        baseStyle.push(styles.inputWithLeftIcon);
      }

      if (rightIcon || showPasswordToggle) {
        baseStyle.push(styles.inputWithRightIcon);
      }

      if (multiline) {
        baseStyle.push(styles.inputMultiline);
      }

      return [...baseStyle, inputStyle];
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, error && styles.labelError]}>
            {label}
          </Text>
        )}

        <View style={[styles.inputContainer, style]}>
          {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

          <TextInput
            ref={ref}
            style={getInputStyle()}
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={secureTextEntry && !showPassword}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            maxLength={maxLength}
            multiline={multiline}
            numberOfLines={numberOfLines}
            editable={!disabled}
            {...props}
          />

          {showPasswordToggle && (
            <TouchableOpacity
              style={styles.rightIconContainer}
              onPress={togglePasswordVisibility}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={sizes.icon.sm}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          )}

          {rightIcon && !showPasswordToggle && (
            <View style={styles.rightIconContainer}>{rightIcon}</View>
          )}
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginBottom: sizes.margin.md,
  },

  label: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.medium,
    color: colors.textSecondary,
    marginBottom: sizes.margin.xs,
  },

  labelError: {
    color: colors.error,
  },

  inputContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    height: sizes.input.height,
    backgroundColor: colors.surface,
    borderRadius: sizes.radius.md,
    paddingHorizontal: sizes.padding.md,
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

  inputDisabled: {
    backgroundColor: colors.surfaceLight,
    color: colors.textMuted,
  },

  inputWithLeftIcon: {
    paddingLeft: sizes.padding.xl + sizes.icon.sm,
  },

  inputWithRightIcon: {
    paddingRight: sizes.padding.xl + sizes.icon.sm,
  },

  inputMultiline: {
    height: "auto",
    minHeight: sizes.input.height,
    paddingTop: sizes.padding.md,
    paddingBottom: sizes.padding.md,
    textAlignVertical: "top",
  },

  leftIconContainer: {
    position: "absolute",
    left: sizes.padding.md,
    zIndex: 1,
  },

  rightIconContainer: {
    position: "absolute",
    right: sizes.padding.md,
    zIndex: 1,
  },

  errorText: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.regular,
    color: colors.error,
    marginTop: sizes.margin.xs,
  },
});

export default Input;

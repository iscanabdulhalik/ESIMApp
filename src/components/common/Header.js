import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import { sizes } from "../../constants/sizes";

const Header = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  showBackButton = false,
  onBackPress,
  transparent = false,
  gradient = false,
  style,
}) => {
  const insets = useSafeAreaInsets();

  const headerStyle = [
    styles.header,
    { paddingTop: insets.top + sizes.padding.sm },
    transparent && styles.transparent,
    style,
  ];

  return (
    <View style={headerStyle}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={transparent ? "transparent" : colors.background}
        translucent={transparent}
      />

      <View style={styles.content}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity style={styles.iconButton} onPress={onBackPress}>
              <Ionicons
                name="arrow-back"
                size={sizes.icon.md}
                color={colors.text}
              />
            </TouchableOpacity>
          )}

          {leftIcon && (
            <TouchableOpacity style={styles.iconButton} onPress={onLeftPress}>
              {leftIcon}
            </TouchableOpacity>
          )}
        </View>

        {/* Center Section */}
        <View style={styles.centerSection}>
          {title && (
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {rightIcon && (
            <TouchableOpacity style={styles.iconButton} onPress={onRightPress}>
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  transparent: {
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: sizes.padding.md,
    paddingBottom: sizes.padding.sm,
    minHeight: sizes.header.height - sizes.padding.sm,
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-start",
  },

  centerSection: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },

  iconButton: {
    width: sizes.icon.lg,
    height: sizes.icon.lg,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: sizes.radius.sm,
  },

  title: {
    fontSize: fonts.size.lg,
    fontFamily: fonts.family.semiBold,
    color: colors.text,
    textAlign: "center",
  },

  subtitle: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.regular,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 2,
  },
});

export default Header;

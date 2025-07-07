import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../constants/colors";
import { sizes } from "../../constants/sizes";

const Card = ({
  children,
  style,
  onPress,
  variant = "default",
  gradient = false,
  gradientColors = colors.gradient.primary,
  padding = sizes.padding.md,
  margin = sizes.margin.sm,
  shadow = true,
  ...props
}) => {
  const getCardStyle = () => {
    const baseStyle = [styles.card];

    if (shadow) {
      baseStyle.push(styles.cardShadow);
    }

    if (variant === "outlined") {
      baseStyle.push(styles.cardOutlined);
    } else if (variant === "elevated") {
      baseStyle.push(styles.cardElevated);
    }

    baseStyle.push({
      padding,
      margin,
    });

    return [...baseStyle, style];
  };

  const CardContent = () => <View style={getCardStyle()}>{children}</View>;

  const GradientCard = () => (
    <View style={[styles.gradientContainer, { margin }]}>
      <LinearGradient
        colors={gradientColors}
        style={[styles.gradientCard, { padding }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {children}
      </LinearGradient>
    </View>
  );

  if (gradient) {
    if (onPress) {
      return (
        <TouchableOpacity onPress={onPress} {...props}>
          <GradientCard />
        </TouchableOpacity>
      );
    }
    return <GradientCard />;
  }

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} {...props}>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: sizes.radius.md,
  },

  cardShadow: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  cardOutlined: {
    borderWidth: 1,
    borderColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },

  cardElevated: {
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  gradientContainer: {
    borderRadius: sizes.radius.md,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  gradientCard: {
    borderRadius: sizes.radius.md,
  },
});

export default Card;

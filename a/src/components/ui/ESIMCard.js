import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import Card from "../common/Card";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import { sizes } from "../../constants/sizes";

const ESIMCard = ({
  esim,
  onPress,
  showUsage = true,
  showActions = true,
  style,
}) => {
  const formatDataUsage = (used, total) => {
    const formatSize = (bytes) => {
      if (bytes < 1024) return `${bytes} MB`;
      return `${(bytes / 1024).toFixed(1)} GB`;
    };

    return `${formatSize(used)} / ${formatSize(total)}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return colors.success;
      case "inactive":
        return colors.warning;
      case "expired":
        return colors.error;
      default:
        return colors.textMuted;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Aktif";
      case "inactive":
        return "Pasif";
      case "expired":
        return "Süresi Dolmuş";
      default:
        return "Bilinmiyor";
    }
  };

  return (
    <Card style={[styles.card, style]} onPress={onPress}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.countryInfo}>
          <Text style={styles.countryFlag}>{esim.countryFlag}</Text>
          <View style={styles.countryDetails}>
            <Text style={styles.countryName}>{esim.country}</Text>
            <Text style={styles.packageName}>{esim.packageName}</Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(esim.status) },
            ]}
          />
          <Text
            style={[styles.statusText, { color: getStatusColor(esim.status) }]}
          >
            {getStatusText(esim.status)}
          </Text>
        </View>
      </View>

      {/* Usage Section */}
      {showUsage && esim.status === "active" && (
        <View style={styles.usageSection}>
          <View style={styles.usageInfo}>
            <Text style={styles.usageLabel}>Veri Kullanımı</Text>
            <Text style={styles.usageValue}>
              {formatDataUsage(esim.dataUsed, esim.dataLimit)}
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={colors.gradient.primary}
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(
                      (esim.dataUsed / esim.dataLimit) * 100,
                      100
                    )}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round((esim.dataUsed / esim.dataLimit) * 100)}%
            </Text>
          </View>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.dateInfo}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={colors.textMuted}
          />
          <Text style={styles.dateText}>
            {esim.expiryDate
              ? `${new Date(esim.expiryDate).toLocaleDateString(
                  "tr-TR"
                )} tarihinde sona eriyor`
              : "Süresiz"}
          </Text>
        </View>

        {showActions && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>

            {esim.status === "active" && (
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons
                  name="analytics-outline"
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: sizes.margin.md,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: sizes.margin.md,
  },

  countryInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  countryFlag: {
    fontSize: 32,
    marginRight: sizes.margin.sm,
  },

  countryDetails: {
    flex: 1,
  },

  countryName: {
    fontSize: fonts.size.md,
    fontFamily: fonts.family.semiBold,
    color: colors.text,
  },

  packageName: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.regular,
    color: colors.textSecondary,
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: sizes.margin.xs,
  },

  statusText: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.medium,
  },

  usageSection: {
    marginBottom: sizes.margin.md,
  },

  usageInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: sizes.margin.xs,
  },

  usageLabel: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.regular,
    color: colors.textSecondary,
  },

  usageValue: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.medium,
    color: colors.text,
  },

  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.surfaceLight,
    borderRadius: 3,
    overflow: "hidden",
    marginRight: sizes.margin.sm,
  },

  progressFill: {
    height: "100%",
    borderRadius: 3,
  },

  progressText: {
    fontSize: fonts.size.xs,
    fontFamily: fonts.family.medium,
    color: colors.textMuted,
    minWidth: 35,
    textAlign: "right",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dateInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  dateText: {
    marginLeft: sizes.margin.xs,
    fontSize: fonts.size.xs,
    fontFamily: fonts.family.regular,
    color: colors.textMuted,
  },

  actionButtons: {
    flexDirection: "row",
  },

  actionButton: {
    marginLeft: sizes.margin.sm,
    padding: sizes.padding.xs,
  },
});

export default ESIMCard;

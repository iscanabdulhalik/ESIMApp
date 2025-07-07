import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import Header from "../../components/common/Header";
import Card from "../../components/common/Card";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { esimService } from "../../services/api/esimService";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import { sizes } from "../../constants/sizes";

const MyESIMsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [esims, setEsims] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filters = [
    { id: "all", name: "Tümü", count: esims.length },
    {
      id: "active",
      name: "Aktif",
      count: esims.filter((e) => e.status === "active").length,
    },
    {
      id: "inactive",
      name: "Pasif",
      count: esims.filter((e) => e.status === "inactive").length,
    },
    {
      id: "expired",
      name: "Süresi Dolmuş",
      count: esims.filter((e) => e.status === "expired").length,
    },
  ];

  useEffect(() => {
    loadESIMs();
  }, []);

  const loadESIMs = async () => {
    try {
      setLoading(true);
      const response = await esimService.getESIMs();

      if (response.success) {
        setEsims(response.data);
      }
    } catch (error) {
      console.error("eSIMs loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadESIMs();
    setRefreshing(false);
  };

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

  const filteredESIMs =
    selectedFilter === "all"
      ? esims
      : esims.filter((esim) => esim.status === selectedFilter);

  const ESIMCard = ({ esim }) => (
    <Card
      style={styles.esimCard}
      onPress={() => navigation.navigate("ESIMDetails", { iccid: esim.iccid })}
    >
      <View style={styles.esimHeader}>
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

      {esim.status === "active" && (
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

      <View style={styles.esimFooter}>
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

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate("ESIMDetails", { iccid: esim.iccid })
            }
          >
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>

          {esim.status === "active" && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                navigation.navigate("Usage", { iccid: esim.iccid })
              }
            >
              <Ionicons
                name="analytics-outline"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Card>
  );

  const FilterButton = ({ filter }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter.id && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(filter.id)}
    >
      <Text
        style={[
          styles.filterText,
          selectedFilter === filter.id && styles.filterTextActive,
        ]}
      >
        {filter.name}
      </Text>
      {filter.count > 0 && (
        <View
          style={[
            styles.filterBadge,
            selectedFilter === filter.id && styles.filterBadgeActive,
          ]}
        >
          <Text
            style={[
              styles.filterBadgeText,
              selectedFilter === filter.id && styles.filterBadgeTextActive,
            ]}
          >
            {filter.count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingSpinner fullScreen text="eSIM'ler yükleniyor..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="eSIM'lerim"
        rightIcon={
          <Ionicons
            name="add-circle-outline"
            size={sizes.icon.md}
            color={colors.text}
          />
        }
        onRightPress={() => navigation.navigate("Store")}
      />

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          renderItem={({ item }) => <FilterButton filter={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.filters}
        />
      </View>

      {/* eSIMs List */}
      {filteredESIMs.length > 0 ? (
        <FlatList
          data={filteredESIMs}
          renderItem={({ item }) => <ESIMCard esim={item} />}
          keyExtractor={(item) => item.iccid}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons
            name="phone-portrait-outline"
            size={sizes.icon.xxl * 2}
            color={colors.textMuted}
          />
          <Text style={styles.emptyTitle}>
            {selectedFilter === "all"
              ? "eSIM bulunamadı"
              : `${
                  filters.find((f) => f.id === selectedFilter)?.name
                } eSIM bulunamadı`}
          </Text>
          <Text style={styles.emptyDescription}>
            {selectedFilter === "all"
              ? "İlk eSIM'inizi satın alın ve dünya çapında internete erişin"
              : "Bu kategoride eSIM bulunmuyor"}
          </Text>

          {selectedFilter === "all" && (
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate("Store")}
            >
              <LinearGradient
                colors={colors.gradient.primary}
                style={styles.emptyButtonGradient}
              >
                <Text style={styles.emptyButtonText}>eSIM Satın Al</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

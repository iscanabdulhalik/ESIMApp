import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { esimService } from "../../services/api/esimService";
import { COLORS, FONTS, SIZES } from "../../constants/theme";

const MyESIMsScreen = ({ navigation }) => {
  const [esims, setEsims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filters = [
    { id: "all", name: "Tümü", count: esims.length },
    {
      id: "active",
      name: "Aktif",
      count: esims.filter((e) => e.status === "active").length,
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
      setIsLoading(true);
      // Mock veriler kullan (gerçek API için esimService.getESIMs() kullanın)
      const response = esimService.getMockESIMs();

      if (response.success) {
        setEsims(response.data);
      }
    } catch (error) {
      console.error("eSIMs loading error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadESIMs();
    setRefreshing(false);
  };

  const formatDataUsage = (used, total) => {
    const formatSize = (mb) => {
      if (mb < 1024) return `${mb} MB`;
      return `${(mb / 1024).toFixed(1)} GB`;
    };
    return `${formatSize(used)} / ${formatSize(total)}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return COLORS.secondary;
      case "expired":
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Aktif";
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
    <TouchableOpacity
      style={styles.esimCard}
      onPress={() => navigation.navigate("ESIMDetails", { iccid: esim.iccid })}
    >
      <View style={styles.cardHeader}>
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
                colors={[COLORS.primary, COLORS.secondary]}
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

      <View style={styles.cardFooter}>
        <View style={styles.dateInfo}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={COLORS.textSecondary}
          />
          <Text style={styles.dateText}>
            {esim.expiryDate
              ? `${new Date(esim.expiryDate).toLocaleDateString(
                  "tr-TR"
                )} tarihinde sona eriyor`
              : "Süresiz"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate("ESIMDetails", { iccid: esim.iccid })
          }
        >
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>eSIM'ler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>eSIM'lerim</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("StoreTab")}
        >
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>

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
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons
            name="phone-portrait-outline"
            size={80}
            color={COLORS.textSecondary}
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
              onPress={() => navigation.navigate("StoreTab")}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  center: {
    justifyContent: "center",
    alignItems: "center",
    padding: SIZES.padding,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding,
    paddingBottom: SIZES.padding / 2,
  },

  headerTitle: {
    ...FONTS.h1,
    color: COLORS.text,
    fontWeight: "bold",
  },

  addButton: {
    padding: SIZES.base,
  },

  filtersContainer: {
    paddingVertical: SIZES.base,
  },

  filters: {
    paddingHorizontal: SIZES.padding,
  },

  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius * 2,
    marginRight: SIZES.base,
  },

  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },

  filterText: {
    ...FONTS.body3,
    color: COLORS.text,
    fontWeight: "500",
  },

  filterTextActive: {
    color: COLORS.white,
  },

  filterBadge: {
    backgroundColor: COLORS.primary,
    marginLeft: SIZES.base / 2,
    paddingHorizontal: SIZES.base / 2,
    paddingVertical: 2,
    borderRadius: SIZES.radius,
    minWidth: 20,
    alignItems: "center",
  },

  filterBadgeActive: {
    backgroundColor: COLORS.white,
  },

  filterBadgeText: {
    ...FONTS.body4,
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "bold",
  },

  filterBadgeTextActive: {
    color: COLORS.primary,
  },

  list: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 20,
  },

  esimCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius * 1.5,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SIZES.padding,
  },

  countryInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  countryFlag: {
    fontSize: 32,
    marginRight: SIZES.base,
  },

  countryDetails: {
    flex: 1,
  },

  countryName: {
    ...FONTS.h3,
    color: COLORS.text,
    fontWeight: "600",
  },

  packageName: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SIZES.base / 2,
  },

  statusText: {
    ...FONTS.body4,
    fontWeight: "500",
  },

  usageSection: {
    marginBottom: SIZES.padding,
  },

  usageInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SIZES.base / 2,
  },

  usageLabel: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
  },

  usageValue: {
    ...FONTS.body4,
    color: COLORS.text,
    fontWeight: "500",
  },

  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.background,
    borderRadius: 3,
    overflow: "hidden",
    marginRight: SIZES.base,
  },

  progressFill: {
    height: "100%",
    borderRadius: 3,
  },

  progressText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontSize: 10,
    minWidth: 35,
    textAlign: "right",
  },

  cardFooter: {
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
    marginLeft: SIZES.base / 2,
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontSize: 10,
  },

  actionButton: {
    padding: SIZES.base / 2,
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SIZES.padding * 2,
  },

  emptyTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    marginTop: SIZES.padding,
    marginBottom: SIZES.base,
    textAlign: "center",
  },

  emptyDescription: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: SIZES.padding * 2,
  },

  emptyButton: {
    borderRadius: SIZES.radius * 2,
  },

  emptyButtonGradient: {
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius * 2,
  },

  emptyButtonText: {
    ...FONTS.h4,
    color: COLORS.white,
    fontWeight: "bold",
  },

  loadingText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginTop: SIZES.base * 2,
  },
});

export default MyESIMsScreen;

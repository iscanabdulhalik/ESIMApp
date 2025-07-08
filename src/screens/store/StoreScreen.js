import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useESIMStore } from "../../stores/esimStore";
import { esimService } from "../../services/api/esimService";
import { COLORS, FONTS, SIZES } from "../../constants/theme";

/**
 * Yeniden kullanılabilir, şık ve bilgilendirici eSIM paket kartı bileşeni.
 */
const PackageCard = React.memo(({ item, onPress }) => {
  // Mock veriler için fallback değerler
  const countryName = item.country || "Global";
  const dataAmount = item.dataAmount
    ? item.dataAmount > 1024
      ? `${(item.dataAmount / 1024).toFixed(1)} GB`
      : `${item.dataAmount} MB`
    : "N/A";
  const validityDays = item.duration || "N/A";
  const price = item.price || 0;
  const flag = item.countryFlag || "🌍";

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      <View style={styles.cardHeader}>
        <Text style={styles.flag}>{flag}</Text>
        <View style={styles.countryInfo}>
          <Text style={styles.countryText}>{countryName}</Text>
          <Text style={styles.providerText}>{item.provider || "Global"}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>${price.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.featureRow}>
          <Ionicons name="wifi" size={16} color={COLORS.primary} />
          <Text style={styles.featureText}>{dataAmount}</Text>
        </View>
        <View style={styles.featureRow}>
          <Ionicons name="time" size={16} color={COLORS.primary} />
          <Text style={styles.featureText}>{validityDays} Gün</Text>
        </View>
        <View style={styles.featureRow}>
          <Ionicons name="flash" size={16} color={COLORS.primary} />
          <Text style={styles.featureText}>{item.speed || "4G/5G"}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Satın Al</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const StoreScreen = ({ navigation }) => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredPackages, setFilteredPackages] = useState([]);

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    // Arama filtresi
    if (searchText.trim() === "") {
      setFilteredPackages(packages);
    } else {
      const filtered = packages.filter(
        (pkg) =>
          pkg.country?.toLowerCase().includes(searchText.toLowerCase()) ||
          pkg.name?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredPackages(filtered);
    }
  }, [searchText, packages]);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Mock veriler kullan (gerçek API entegrasyonu için esimService.getPackages() kullanın)
      const response = esimService.getMockPackages();

      if (response.success) {
        setPackages(response.data);
        setFilteredPackages(response.data);
      } else {
        setError("Paketler yüklenemedi");
      }
    } catch (err) {
      console.error("Package fetch error:", err);
      setError("Paketler yüklenirken hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    fetchPackages();
  }, []);

  const handlePackageSelect = (selectedPackage) => {
    navigation.navigate("PurchaseSummary", { packageDetails: selectedPackage });
  };

  if (isLoading && packages.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Paketler Yükleniyor...</Text>
      </View>
    );
  }

  if (error && packages.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <Ionicons name="wifi-off" size={64} color={COLORS.textSecondary} />
        <Text style={styles.errorText}>Bir Hata Oluştu</Text>
        <Text style={styles.errorSubText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>eSIM Mağazası</Text>
        <Text style={styles.headerSubtitle}>
          Dünyayı Keşfet, Bağlantıda Kal
        </Text>

        {/* Arama çubuğu */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Ülke ara..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <FlatList
        data={filteredPackages}
        renderItem={({ item }) => (
          <PackageCard item={item} onPress={handlePackageSelect} />
        )}
        keyExtractor={(item) =>
          item.id?.toString() || `package-${Math.random()}`
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.center}>
            <Ionicons
              name="storefront-outline"
              size={64}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>
              {searchText
                ? "Arama sonucu bulunamadı"
                : "Gösterilecek paket bulunamadı"}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SIZES.padding,
  },

  header: {
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding,
    paddingBottom: SIZES.padding / 2,
  },

  headerTitle: {
    ...FONTS.h1,
    color: COLORS.text,
    fontWeight: "bold",
    marginBottom: 4,
  },

  headerSubtitle: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginBottom: SIZES.padding,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding / 1.5,
    paddingVertical: SIZES.base,
  },

  searchInput: {
    flex: 1,
    marginLeft: SIZES.base,
    ...FONTS.body3,
    color: COLORS.text,
  },

  listContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 20,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius * 1.5,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.padding,
  },

  flag: {
    fontSize: 32,
    marginRight: SIZES.base,
  },

  countryInfo: {
    flex: 1,
  },

  countryText: {
    ...FONTS.h3,
    color: COLORS.text,
    fontWeight: "600",
  },

  providerText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
  },

  priceContainer: {
    alignItems: "flex-end",
  },

  priceText: {
    ...FONTS.h2,
    color: COLORS.primary,
    fontWeight: "700",
  },

  cardBody: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: SIZES.padding,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  featureText: {
    marginLeft: SIZES.base / 2,
    ...FONTS.body4,
    color: COLORS.text,
    fontWeight: "500",
  },

  cardFooter: {
    alignItems: "center",
  },

  buyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base * 1.5,
    paddingHorizontal: SIZES.padding * 2,
    borderRadius: SIZES.radius * 2,
    minWidth: 120,
    alignItems: "center",
  },

  buyButtonText: {
    ...FONTS.h4,
    color: COLORS.white,
    fontWeight: "bold",
  },

  loadingText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginTop: SIZES.base * 2,
  },

  errorText: {
    ...FONTS.h2,
    color: COLORS.error,
    textAlign: "center",
    marginBottom: SIZES.base,
  },

  errorSubText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SIZES.padding,
  },

  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
  },

  retryButtonText: {
    ...FONTS.h4,
    color: COLORS.white,
    fontWeight: "bold",
  },

  emptyText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SIZES.padding,
  },
});

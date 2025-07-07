import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl,
  Dimensions,
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

const { width } = Dimensions.get("window");

const StoreScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [countries, setCountries] = useState([]);
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [popularPackages, setPopularPackages] = useState([]);

  const categories = [
    { id: "all", name: "Tümü", icon: "globe-outline" },
    { id: "popular", name: "Popüler", icon: "star-outline" },
    { id: "regional", name: "Bölgesel", icon: "location-outline" },
    { id: "global", name: "Global", icon: "earth-outline" },
  ];

  useEffect(() => {
    loadStoreData();
  }, []);

  useEffect(() => {
    filterPackages();
  }, [searchQuery, selectedCategory, packages]);

  const loadStoreData = async () => {
    try {
      setLoading(true);

      const [countriesResponse, packagesResponse, popularResponse] =
        await Promise.all([
          esimService.getCountries(),
          esimService.getPackages(),
          esimService.getPopularPackages(),
        ]);

      if (countriesResponse.success) {
        setCountries(countriesResponse.data);
      }

      if (packagesResponse.success) {
        setPackages(packagesResponse.data);
      }

      if (popularResponse.success) {
        setPopularPackages(popularResponse.data);
      }
    } catch (error) {
      console.error("Store data loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStoreData();
    setRefreshing(false);
  };

  const filterPackages = () => {
    let filtered = packages;

    // Category filter
    if (selectedCategory === "popular") {
      filtered = popularPackages;
    } else if (selectedCategory === "regional") {
      filtered = packages.filter((pkg) => pkg.type === "regional");
    } else if (selectedCategory === "global") {
      filtered = packages.filter((pkg) => pkg.type === "global");
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (pkg) =>
          pkg.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPackages(filtered);
  };

  const formatDataAmount = (mb) => {
    if (mb < 1024) return `${mb} MB`;
    return `${(mb / 1024).toFixed(1)} GB`;
  };

  const formatDuration = (days) => {
    if (days < 30) return `${days} Gün`;
    return `${Math.round(days / 30)} Ay`;
  };

  const CategoryButton = ({ category }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === category.id && styles.categoryButtonActive,
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Ionicons
        name={category.icon}
        size={sizes.icon.sm}
        color={
          selectedCategory === category.id ? colors.text : colors.textMuted
        }
      />
      <Text
        style={[
          styles.categoryText,
          selectedCategory === category.id && styles.categoryTextActive,
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const PackageCard = ({ package: pkg }) => (
    <Card
      style={styles.packageCard}
      onPress={() => navigation.navigate("Purchase", { packageId: pkg.id })}
    >
      <View style={styles.packageHeader}>
        <View style={styles.countryInfo}>
          <Text style={styles.countryFlag}>{pkg.countryFlag}</Text>
          <View style={styles.countryDetails}>
            <Text style={styles.countryName}>{pkg.country}</Text>
            {pkg.coverage && (
              <Text style={styles.coverage}>{pkg.coverage}</Text>
            )}
          </View>
        </View>

        {pkg.isPopular && (
          <View style={styles.popularBadge}>
            <LinearGradient
              colors={colors.gradient.accent}
              style={styles.popularBadgeGradient}
            >
              <Ionicons name="star" size={12} color={colors.text} />
              <Text style={styles.popularText}>Popüler</Text>
            </LinearGradient>
          </View>
        )}
      </View>

      <View style={styles.packageDetails}>
        <View style={styles.packageFeature}>
          <Ionicons name="wifi" size={sizes.icon.sm} color={colors.primary} />
          <Text style={styles.featureText}>
            {formatDataAmount(pkg.dataAmount)}
          </Text>
        </View>

        <View style={styles.packageFeature}>
          <Ionicons name="time" size={sizes.icon.sm} color={colors.primary} />
          <Text style={styles.featureText}>{formatDuration(pkg.duration)}</Text>
        </View>

        <View style={styles.packageFeature}>
          <Ionicons name="flash" size={sizes.icon.sm} color={colors.primary} />
          <Text style={styles.featureText}>{pkg.speed || "4G/5G"}</Text>
        </View>
      </View>

      <View style={styles.packageFooter}>
        <View style={styles.priceInfo}>
          <Text style={styles.price}>${pkg.price}</Text>
          {pkg.originalPrice && pkg.originalPrice > pkg.price && (
            <Text style={styles.originalPrice}>${pkg.originalPrice}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => navigation.navigate("Purchase", { packageId: pkg.id })}
        >
          <LinearGradient
            colors={colors.gradient.primary}
            style={styles.buyButtonGradient}
          >
            <Text style={styles.buyButtonText}>Satın Al</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const CountryCard = ({ country }) => (
    <TouchableOpacity
      style={styles.countryCard}
      onPress={() =>
        navigation.navigate("CountryPackages", { countryId: country.id })
      }
    >
      <Text style={styles.countryCardFlag}>{country.flag}</Text>
      <Text style={styles.countryCardName}>{country.name}</Text>
      <Text style={styles.countryCardPackages}>
        {country.packageCount} Paket
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingSpinner fullScreen text="Mağaza yükleniyor..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="eSIM Mağaza"
        rightIcon={
          <Ionicons
            name="filter-outline"
            size={sizes.icon.md}
            color={colors.text}
          />
        }
        onRightPress={() => navigation.navigate("Filters")}
      />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons
              name="search-outline"
              size={sizes.icon.sm}
              color={colors.textMuted}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Ülke veya paket ara..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categories}
          >
            {categories.map((category) => (
              <CategoryButton key={category.id} category={category} />
            ))}
          </ScrollView>
        </View>

        {/* Featured Banner */}
        <Card
          gradient
          gradientColors={colors.gradient.primary}
          style={styles.featuredBanner}
          onPress={() => navigation.navigate("FeaturedPackages")}
        >
          <View style={styles.bannerContent}>
            <View style={styles.bannerText}>
              <Text style={styles.bannerTitle}>Özel Fırsat!</Text>
              <Text style={styles.bannerDescription}>
                Seçili ülkelerde %30 indirim
              </Text>
            </View>
            <Ionicons
              name="airplane"
              size={sizes.icon.lg}
              color={colors.text}
            />
          </View>
        </Card>

        {/* Popular Countries */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popüler Ülkeler</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("AllCountries")}
            >
              <Text style={styles.seeAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.countriesContainer}
          >
            {countries.slice(0, 8).map((country) => (
              <CountryCard key={country.id} country={country} />
            ))}
          </ScrollView>
        </View>

        {/* Packages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === "all"
              ? "Tüm Paketler"
              : selectedCategory === "popular"
              ? "Popüler Paketler"
              : selectedCategory === "regional"
              ? "Bölgesel Paketler"
              : "Global Paketler"}
          </Text>

          {filteredPackages.length > 0 ? (
            filteredPackages.map((pkg) => (
              <PackageCard key={pkg.id} package={pkg} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="search-outline"
                size={sizes.icon.xxl}
                color={colors.textMuted}
              />
              <Text style={styles.emptyTitle}>Paket bulunamadı</Text>
              <Text style={styles.emptyDescription}>
                Arama kriterlerinizi değiştirip tekrar deneyin
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollView: {
    flex: 1,
  },

  searchContainer: {
    padding: sizes.padding.md,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: sizes.radius.md,
    paddingHorizontal: sizes.padding.md,
    height: sizes.input.height,
  },

  searchInput: {
    flex: 1,
    marginLeft: sizes.margin.sm,
    fontSize: fonts.size.md,
    fontFamily: fonts.family.regular,
    color: colors.text,
  },

  categoriesContainer: {
    marginBottom: sizes.margin.md,
  },

  categories: {
    paddingHorizontal: sizes.padding.md,
  },

  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: sizes.padding.md,
    paddingVertical: sizes.padding.sm,
    marginRight: sizes.margin.sm,
    borderRadius: sizes.radius.md,
    backgroundColor: colors.surface,
  },

  categoryButtonActive: {
    backgroundColor: colors.primary,
  },

  categoryText: {
    marginLeft: sizes.margin.xs,
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.medium,
    color: colors.textMuted,
  },

  categoryTextActive: {
    color: colors.text,
  },

  featuredBanner: {
    margin: sizes.margin.md,
    marginTop: 0,
  },

  bannerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  bannerText: {
    flex: 1,
  },

  bannerTitle: {
    fontSize: fonts.size.lg,
    fontFamily: fonts.family.bold,
    color: colors.text,
    marginBottom: 4,
  },

  bannerDescription: {
    fontSize: fonts.size.md,
    fontFamily: fonts.family.regular,
    color: colors.text,
    opacity: 0.9,
  },

  section: {
    padding: sizes.padding.md,
    paddingTop: 0,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: sizes.margin.md,
  },

  sectionTitle: {
    fontSize: fonts.size.lg,
    fontFamily: fonts.family.semiBold,
    color: colors.text,
  },

  seeAllText: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.medium,
    color: colors.primary,
  },

  countriesContainer: {
    paddingVertical: sizes.padding.sm,
  },

  countryCard: {
    alignItems: "center",
    marginRight: sizes.margin.md,
    padding: sizes.padding.sm,
    backgroundColor: colors.surface,
    borderRadius: sizes.radius.md,
    width: 80,
  },

  countryCardFlag: {
    fontSize: 32,
    marginBottom: sizes.margin.xs,
  },

  countryCardName: {
    fontSize: fonts.size.xs,
    fontFamily: fonts.family.medium,
    color: colors.text,
    textAlign: "center",
    marginBottom: 2,
  },

  countryCardPackages: {
    fontSize: fonts.size.xs,
    fontFamily: fonts.family.regular,
    color: colors.textMuted,
  },

  packageCard: {
    marginBottom: sizes.margin.md,
  },

  packageHeader: {
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

  coverage: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.regular,
    color: colors.textSecondary,
  },

  popularBadge: {
    borderRadius: sizes.radius.sm,
    overflow: "hidden",
  },

  popularBadgeGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: sizes.padding.sm,
    paddingVertical: 4,
  },

  popularText: {
    marginLeft: 4,
    fontSize: fonts.size.xs,
    fontFamily: fonts.family.medium,
    color: colors.text,
  },

  packageDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: sizes.margin.md,
  },

  packageFeature: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  featureText: {
    marginLeft: sizes.margin.xs,
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.medium,
    color: colors.text,
  },

  packageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  priceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  price: {
    fontSize: fonts.size.lg,
    fontFamily: fonts.family.bold,
    color: colors.primary,
  },

  originalPrice: {
    marginLeft: sizes.margin.sm,
    fontSize: fonts.size.md,
    fontFamily: fonts.family.regular,
    color: colors.textMuted,
    textDecorationLine: "line-through",
  },

  buyButton: {
    borderRadius: sizes.radius.md,
    overflow: "hidden",
  },

  buyButtonGradient: {
    paddingHorizontal: sizes.padding.lg,
    paddingVertical: sizes.padding.sm,
  },

  buyButtonText: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.medium,
    color: colors.text,
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: sizes.padding.xxl,
  },

  emptyTitle: {
    fontSize: fonts.size.lg,
    fontFamily: fonts.family.semiBold,
    color: colors.text,
    marginTop: sizes.margin.md,
    marginBottom: sizes.margin.sm,
  },

  emptyDescription: {
    fontSize: fonts.size.md,
    fontFamily: fonts.family.regular,
    color: colors.textSecondary,
    textAlign: "center",
  },
});

export default StoreScreen;

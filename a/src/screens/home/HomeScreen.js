import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../context/AuthContext";
import Card from "../../components/common/Card";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { esimService } from "../../services/api/esimService";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import { sizes } from "../../constants/sizes";
import { globalStyles } from "../../styles/globalStyles";

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeESIMs, setActiveESIMs] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [totalDataUsage, setTotalDataUsage] = useState(0);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);

      // Paralel API çağrıları
      const [esimsResponse, ordersResponse] = await Promise.all([
        esimService.getESIMs("active"),
        esimService.getOrders("recent", 1, 5),
      ]);

      if (esimsResponse.success) {
        setActiveESIMs(esimsResponse.data);

        // Toplam data kullanımını hesapla
        const totalUsage = esimsResponse.data.reduce((sum, esim) => {
          return sum + (esim.dataUsed || 0);
        }, 0);
        setTotalDataUsage(totalUsage);
      }

      if (ordersResponse.success) {
        setRecentOrders(ordersResponse.data);
      }
    } catch (error) {
      console.error("Home data loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  const formatDataUsage = (bytes) => {
    if (bytes < 1024) return `${bytes} MB`;
    return `${(bytes / 1024).toFixed(1)} GB`;
  };

  const QuickActionButton = ({ icon, title, onPress, gradient = false }) => (
    <TouchableOpacity onPress={onPress} style={styles.quickActionContainer}>
      <Card style={styles.quickAction}>
        <View style={styles.quickActionIcon}>
          {gradient ? (
            <LinearGradient
              colors={colors.gradient.primary}
              style={styles.gradientIcon}
            >
              <Ionicons name={icon} size={sizes.icon.md} color={colors.text} />
            </LinearGradient>
          ) : (
            <View style={styles.normalIcon}>
              <Ionicons
                name={icon}
                size={sizes.icon.md}
                color={colors.primary}
              />
            </View>
          )}
        </View>
        <Text style={styles.quickActionText}>{title}</Text>
      </Card>
    </TouchableOpacity>
  );

  const ESIMCard = ({ esim }) => (
    <Card
      style={styles.esimCard}
      onPress={() => navigation.navigate("ESIMDetails", { iccid: esim.iccid })}
    >
      <View style={styles.esimHeader}>
        <View>
          <Text style={styles.esimCountry}>{esim.country}</Text>
          <Text style={styles.esimProvider}>{esim.provider}</Text>
        </View>
        <View style={styles.esimStatus}>
          <View
            style={[styles.statusDot, { backgroundColor: colors.success }]}
          />
          <Text style={styles.statusText}>Aktif</Text>
        </View>
      </View>

      <View style={styles.esimUsage}>
        <View style={styles.usageInfo}>
          <Text style={styles.usageLabel}>Kullanılan</Text>
          <Text style={styles.usageValue}>
            {formatDataUsage(esim.dataUsed)} / {formatDataUsage(esim.dataLimit)}
          </Text>
        </View>

        <View style={styles.progressBar}>
          <LinearGradient
            colors={colors.gradient.primary}
            style={[
              styles.progressFill,
              { width: `${(esim.dataUsed / esim.dataLimit) * 100}%` },
            ]}
          />
        </View>
      </View>
    </Card>
  );

  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen text="Veriler yükleniyor..." />;
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Merhaba,</Text>
            <Text style={styles.userName}>
              {user?.firstName || "Kullanıcı"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Ionicons
              name="notifications-outline"
              size={sizes.icon.md}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Stats Card */}
        <Card
          gradient
          gradientColors={colors.gradient.primary}
          style={styles.statsCard}
        >
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{activeESIMs.length}</Text>
              <Text style={styles.statLabel}>Aktif eSIM</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {formatDataUsage(totalDataUsage)}
              </Text>
              <Text style={styles.statLabel}>Toplam Kullanım</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{recentOrders.length}</Text>
              <Text style={styles.statLabel}>Son Siparişler</Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>

          <View style={styles.quickActions}>
            <QuickActionButton
              icon="storefront-outline"
              title="eSIM Satın Al"
              gradient
              onPress={() => navigation.navigate("Store")}
            />

            <QuickActionButton
              icon="qr-code-outline"
              title="QR Kod Tara"
              onPress={() => navigation.navigate("QRScanner")}
            />

            <QuickActionButton
              icon="analytics-outline"
              title="Kullanım"
              onPress={() => navigation.navigate("Usage")}
            />

            <QuickActionButton
              icon="help-circle-outline"
              title="Destek"
              onPress={() => navigation.navigate("Support")}
            />
          </View>
        </View>

        {/* Active eSIMs */}
        {activeESIMs.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Aktif eSIM'ler</Text>
              <TouchableOpacity onPress={() => navigation.navigate("MyESIMs")}>
                <Text style={styles.seeAllButton}>Tümünü Gör</Text>
              </TouchableOpacity>
            </View>

            {activeESIMs.slice(0, 2).map((esim) => (
              <ESIMCard key={esim.iccid} esim={esim} />
            ))}
          </View>
        )}

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Son Siparişler</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Orders")}>
                <Text style={styles.seeAllButton}>Tümünü Gör</Text>
              </TouchableOpacity>
            </View>

            {recentOrders.map((order) => (
              <Card
                key={order.id}
                style={styles.orderCard}
                onPress={() =>
                  navigation.navigate("OrderDetails", { orderId: order.id })
                }
              >
                <View style={styles.orderHeader}>
                  <Text style={styles.orderCountry}>{order.country}</Text>
                  <Text style={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                  </Text>
                </View>

                <Text style={styles.orderPackage}>{order.packageName}</Text>

                <View style={styles.orderFooter}>
                  <Text style={styles.orderPrice}>${order.price}</Text>
                  <View
                    style={[
                      styles.orderStatus,
                      {
                        backgroundColor:
                          order.status === "completed"
                            ? colors.success
                            : colors.warning,
                      },
                    ]}
                  >
                    <Text style={styles.orderStatusText}>
                      {order.status === "completed"
                        ? "Tamamlandı"
                        : "Beklemede"}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Empty State */}
        {activeESIMs.length === 0 && recentOrders.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons
              name="phone-portrait-outline"
              size={sizes.icon.xxl * 2}
              color={colors.textMuted}
            />
            <Text style={styles.emptyTitle}>eSIM'iniz bulunmuyor</Text>
            <Text style={styles.emptyDescription}>
              İlk eSIM'inizi satın alın ve dünya çapında internete erişin
            </Text>

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
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: sizes.padding.md,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: sizes.margin.lg,
  },

  greeting: {
    fontSize: fonts.size.md,
    fontFamily: fonts.family.regular,
    color: colors.textSecondary,
  },

  userName: {
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.bold,
    color: colors.text,
  },

  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },

  statsCard: {
    marginBottom: sizes.margin.lg,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statValue: {
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.bold,
    color: colors.text,
    marginBottom: 4,
  },

  statLabel: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.regular,
    color: colors.text,
    opacity: 0.8,
  },

  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.text,
    opacity: 0.2,
  },

  section: {
    marginBottom: sizes.margin.lg,
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

  seeAllButton: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.medium,
    color: colors.primary,
  },

  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  quickActionContainer: {
    width: (width - sizes.padding.md * 2 - sizes.margin.sm) / 2,
    marginBottom: sizes.margin.sm,
  },

  quickAction: {
    alignItems: "center",
    padding: sizes.padding.lg,
  },

  quickActionIcon: {
    marginBottom: sizes.margin.sm,
  },

  gradientIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  normalIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },

  quickActionText: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.medium,
    color: colors.text,
    textAlign: "center",
  },

  esimCard: {
    marginBottom: sizes.margin.sm,
  },

  esimHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: sizes.margin.md,
  },

  esimCountry: {
    fontSize: fonts.size.md,
    fontFamily: fonts.family.semiBold,
    color: colors.text,
  },

  esimProvider: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.regular,
    color: colors.textSecondary,
  },

  esimStatus: {
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
    color: colors.success,
  },

  esimUsage: {
    marginTop: sizes.margin.sm,
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

  progressBar: {
    height: 6,
    backgroundColor: colors.surfaceLight,
    borderRadius: 3,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 3,
  },

  orderCard: {
    marginBottom: sizes.margin.sm,
  },

  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: sizes.margin.xs,
  },

  orderCountry: {
    fontSize: fonts.size.md,
    fontFamily: fonts.family.semiBold,
    color: colors.text,
  },

  orderDate: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.regular,
    color: colors.textSecondary,
  },

  orderPackage: {
    fontSize: fonts.size.sm,
    fontFamily: fonts.family.regular,
    color: colors.textSecondary,
    marginBottom: sizes.margin.sm,
  },

  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  orderPrice: {
    fontSize: fonts.size.md,
    fontFamily: fonts.family.semiBold,
    color: colors.primary,
  },

  orderStatus: {
    paddingHorizontal: sizes.padding.sm,
    paddingVertical: 4,
    borderRadius: sizes.radius.sm,
  },

  orderStatusText: {
    fontSize: fonts.size.xs,
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
    marginTop: sizes.margin.lg,
    marginBottom: sizes.margin.sm,
  },

  emptyDescription: {
    fontSize: fonts.size.md,
    fontFamily: fonts.family.regular,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: sizes.margin.xl,
    paddingHorizontal: sizes.padding.lg,
  },

  emptyButton: {
    borderRadius: sizes.radius.md,
  },

  emptyButtonGradient: {
    paddingHorizontal: sizes.padding.xl,
    paddingVertical: sizes.padding.md,
    borderRadius: sizes.radius.md,
  },

  emptyButtonText: {
    fontSize: fonts.size.md,
    fontFamily: fonts.family.medium,
    color: colors.text,
  },
});

export default HomeScreen;

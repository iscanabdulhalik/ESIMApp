import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Notification ayarları
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  // Push notification izni al
  requestPermissions: async () => {
    try {
      if (!Device.isDevice) {
        console.warn("Push notifications çalışmaz emülatörde");
        return { success: false, error: "Fiziksel cihaz gerekli" };
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        return { success: false, error: "Notification izni reddedildi" };
      }

      // Android için channel oluştur
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "DataGo eSIM",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#1E3A8A",
        });

        // Data usage alerts channel
        await Notifications.setNotificationChannelAsync("data-usage", {
          name: "Veri Kullanım Uyarıları",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 500],
          lightColor: "#F59E0B",
        });

        // Order updates channel
        await Notifications.setNotificationChannelAsync("orders", {
          name: "Sipariş Güncellemeleri",
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#10B981",
        });
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Push token al
  getPushToken: async () => {
    try {
      const token = await Notifications.getExpoPushTokenAsync();
      await AsyncStorage.setItem("pushToken", token.data);
      return { success: true, token: token.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Local notification gönder
  scheduleLocalNotification: async (title, body, data = {}, trigger = null) => {
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger,
      });

      return { success: true, notificationId: id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Tüm pending notification'ları iptal et
  cancelAllNotifications: async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Belirli notification'ı iptal et
  cancelNotification: async (notificationId) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Data kullanım uyarısı
  scheduleDataUsageAlert: async (esimName, usagePercentage) => {
    const title = "Veri Kullanım Uyarısı";
    const body = `${esimName} eSIM'inizin %${usagePercentage} verisi kullanıldı`;

    return await notificationService.scheduleLocalNotification(title, body, {
      type: "data_usage_alert",
      esimName,
      usagePercentage,
      channelId: "data-usage",
    });
  },

  // eSIM süresi dolma uyarısı
  scheduleExpiryAlert: async (esimName, daysRemaining) => {
    const title = "eSIM Süresi Dolacak";
    const body = `${esimName} eSIM'inizin süresi ${daysRemaining} gün sonra dolacak`;

    // 3 gün öncesinden uyarı
    const trigger = {
      seconds: Math.max((daysRemaining - 3) * 24 * 60 * 60, 60), // En az 1 dakika sonra
    };

    return await notificationService.scheduleLocalNotification(
      title,
      body,
      {
        type: "expiry_alert",
        esimName,
        daysRemaining,
      },
      trigger
    );
  },

  // Sipariş durumu bildirimi
  scheduleOrderNotification: async (orderId, status, message) => {
    const title = "Sipariş Durumu";
    const body = message;

    return await notificationService.scheduleLocalNotification(title, body, {
      type: "order_status",
      orderId,
      status,
      channelId: "orders",
    });
  },

  // Hoş geldin bildirimi
  scheduleWelcomeNotification: async (userName) => {
    const title = "DataGo eSIM'e Hoş Geldiniz!";
    const body = `Merhaba ${userName}, ilk eSIM\'inizi satın almaya hazır mısınız?`;

    // 1 saat sonra gönder
    const trigger = {
      seconds: 60 * 60,
    };

    return await notificationService.scheduleLocalNotification(
      title,
      body,
      {
        type: "welcome",
        userName,
      },
      trigger
    );
  },

  // Promosyon bildirimi
  schedulePromotionNotification: async (
    promoTitle,
    promoMessage,
    deepLink = null
  ) => {
    const title = promoTitle;
    const body = promoMessage;

    return await notificationService.scheduleLocalNotification(title, body, {
      type: "promotion",
      deepLink,
    });
  },

  // eSIM aktivasyon hatırlatması
  scheduleActivationReminder: async (esimName, purchaseDate) => {
    const title = "eSIM Aktivasyon Hatırlatması";
    const body = `${esimName} eSIM'inizi henüz aktive etmediniz. 30 gün içinde aktive etmeyi unutmayın!`;

    // 7 gün sonra hatırlat
    const trigger = {
      seconds: 7 * 24 * 60 * 60,
    };

    return await notificationService.scheduleLocalNotification(
      title,
      body,
      {
        type: "activation_reminder",
        esimName,
        purchaseDate,
      },
      trigger
    );
  },

  // Bildirim listener'ları
  addNotificationListener: (handler) => {
    return Notifications.addNotificationReceivedListener(handler);
  },

  addNotificationResponseListener: (handler) => {
    return Notifications.addNotificationResponseReceivedListener(handler);
  },

  // Listener'ları kaldır
  removeNotificationListener: (subscription) => {
    if (subscription) {
      subscription.remove();
    }
  },

  // Badge sayısını ayarla
  setBadgeCount: async (count) => {
    try {
      await Notifications.setBadgeCountAsync(count);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Badge sayısını temizle
  clearBadge: async () => {
    return await notificationService.setBadgeCount(0);
  },

  // Bildirim geçmişini temizle
  clearNotificationHistory: async () => {
    try {
      await Notifications.dismissAllNotificationsAsync();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Bildirim ayarlarını kontrol et
  checkNotificationSettings: async () => {
    try {
      const settings = await Notifications.getPermissionsAsync();
      return {
        success: true,
        settings: {
          granted: settings.status === "granted",
          ios: settings.ios || {},
          android: settings.android || {},
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Scheduled notification'ları listele
  getScheduledNotifications: async () => {
    try {
      const notifications =
        await Notifications.getAllScheduledNotificationsAsync();
      return { success: true, notifications };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Bildirim kategorilerine göre filtrele
  cancelNotificationsByType: async (type) => {
    try {
      const notifications =
        await Notifications.getAllScheduledNotificationsAsync();
      const typeNotifications = notifications.filter(
        (n) => n.content.data?.type === type
      );

      for (const notification of typeNotifications) {
        await Notifications.cancelScheduledNotificationAsync(
          notification.identifier
        );
      }

      return { success: true, cancelled: typeNotifications.length };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Bildirim istatistikleri
  getNotificationStats: async () => {
    try {
      const notifications =
        await Notifications.getAllScheduledNotificationsAsync();
      const stats = {
        total: notifications.length,
        byType: {},
      };

      notifications.forEach((n) => {
        const type = n.content.data?.type || "unknown";
        stats.byType[type] = (stats.byType[type] || 0) + 1;
      });

      return { success: true, stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

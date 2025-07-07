// src/constants/theme.js

export const COLORS = {
  // Ana Renkler
  primary: "#9B59B6", // Mor: Ana eylem butonları, vurgular, aktif sekmeler
  secondary: "#2ECC71", // Yeşil: Başarı durumları, etiketler (örn: "GLOBAL"), online durumu

  // Nötr Renkler (Koyu Tema)
  background: "#121212", // Ana arka plan
  surface: "#1E1E1E", // Kartlar, input alanları, modal arka planları

  // Metin Renkleri
  text: "#EAEAEA", // Ana metinler (tam beyaz değil, daha yumuşak)
  textSecondary: "#A9A9A9", // Yardımcı metinler, açıklamalar, pasif ikonlar

  // Diğer Renkler
  white: "#FFFFFF",
  black: "#000000",
  error: "#E74C3C", // Hata mesajları, uyarılar
  success: "#2ECC71", // Başarı bildirimleri

  // Degrade (Gradient) Renkler
  gradientPrimary: ["#8E44AD", "#9B59B6"], // Mor degrade
  gradientSecondary: ["#27AE60", "#2ECC71"], // Yeşil degrade
};

export const SIZES = {
  // Global boyutlar
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  // Font boyutları
  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
};

export const FONTS = {
  h1: { fontFamily: "System", fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontFamily: "System", fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontFamily: "System", fontSize: SIZES.h3, lineHeight: 22 },
  h4: { fontFamily: "System", fontSize: SIZES.h4, lineHeight: 22 },
  body1: { fontFamily: "System", fontSize: SIZES.body1, lineHeight: 36 },
  body2: { fontFamily: "System", fontSize: SIZES.body2, lineHeight: 30 },
  body3: { fontFamily: "System", fontSize: SIZES.body3, lineHeight: 22 },
  body4: { fontFamily: "System", fontSize: SIZES.body4, lineHeight: 22 },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;

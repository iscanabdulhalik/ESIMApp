// Para formatlaması
export const formatPrice = (amount, currency = "USD") => {
  const formatters = {
    USD: (val) => `$${val.toFixed(2)}`,
    EUR: (val) => `€${val.toFixed(2)}`,
    TRY: (val) => `₺${val.toFixed(2)}`,
    GBP: (val) => `£${val.toFixed(2)}`,
  };

  return formatters[currency]
    ? formatters[currency](amount)
    : `${amount} ${currency}`;
};

// Veri boyutu formatlaması
export const formatDataAmount = (mb) => {
  if (mb < 1024) {
    return `${mb} MB`;
  } else {
    const gb = (mb / 1024).toFixed(mb % 1024 === 0 ? 0 : 1);
    return `${gb} GB`;
  }
};

// Süre formatlaması
export const formatDuration = (days) => {
  if (days < 7) {
    return `${days} Gün`;
  } else if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} Hafta`;
  } else if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} Ay`;
  } else {
    const years = Math.floor(days / 365);
    return `${years} Yıl`;
  }
};

// Telefon numarası formatlaması
export const formatPhoneNumber = (phone) => {
  if (!phone) return "";

  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 11 && cleaned.startsWith("0")) {
    return cleaned.replace(
      /(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/,
      "$1 $2 $3 $4 $5"
    );
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4");
  }

  return phone;
};

// Kart numarası formatlaması
export const formatCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s/g, "");
  const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim();
  return formatted;
};

// Son kullanma tarihi formatlaması
export const formatExpiryDate = (date) => {
  const cleaned = date.replace(/\D/g, "");
  if (cleaned.length >= 2) {
    return (
      cleaned.substring(0, 2) +
      (cleaned.length > 2 ? "/" + cleaned.substring(2, 4) : "")
    );
  }
  return cleaned;
};

// ICCID formatlaması
export const formatICCID = (iccid) => {
  if (!iccid) return "";
  return iccid.replace(/(.{4})/g, "$1 ").trim();
};

// Yüzde formatlaması
export const formatPercentage = (value, decimals = 0) => {
  return `${value.toFixed(decimals)}%`;
};

// Compact sayı formatlaması (1K, 1M gibi)
export const formatCompactNumber = (number) => {
  if (number < 1000) {
    return number.toString();
  } else if (number < 1000000) {
    return `${(number / 1000).toFixed(1)}K`;
  } else if (number < 1000000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  } else {
    return `${(number / 1000000000).toFixed(1)}B`;
  }
};

// Tarih formatlaması
export const formatDate = (date, format = "DD/MM/YYYY") => {
  if (!date) return "";

  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");

  switch (format) {
    case "DD/MM/YYYY":
      return `${day}/${month}/${year}`;
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`;
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    case "DD/MM/YYYY HH:mm":
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    case "relative":
      return formatRelativeTime(d);
    default:
      return d.toLocaleDateString("tr-TR");
  }
};

// Göreceli zaman formatlaması
export const formatRelativeTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${years} yıl önce`;
  } else if (months > 0) {
    return `${months} ay önce`;
  } else if (days > 0) {
    return `${days} gün önce`;
  } else if (hours > 0) {
    return `${hours} saat önce`;
  } else if (minutes > 0) {
    return `${minutes} dakika önce`;
  } else {
    return "Az önce";
  }
};

// Dosya boyutu formatlaması
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// Sayı formatlaması (binlik ayırıcı ile)
export const formatNumber = (number, locale = "tr-TR") => {
  return new Intl.NumberFormat(locale).format(number);
};

// Veri kullanımı formatlaması
export const formatDataUsage = (used, total) => {
  const usedFormatted = formatDataAmount(used);
  const totalFormatted = formatDataAmount(total);
  const percentage = total > 0 ? Math.round((used / total) * 100) : 0;

  return {
    text: `${usedFormatted} / ${totalFormatted}`,
    percentage,
    usedFormatted,
    totalFormatted,
  };
};

// Hız formatlaması
export const formatSpeed = (mbps) => {
  if (mbps < 1) {
    return `${(mbps * 1000).toFixed(0)} Kbps`;
  } else if (mbps < 1000) {
    return `${mbps.toFixed(1)} Mbps`;
  } else {
    return `${(mbps / 1000).toFixed(1)} Gbps`;
  }
};

// Mesafe formatlaması
export const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${meters} m`;
  } else {
    return `${(meters / 1000).toFixed(1)} km`;
  }
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Title case
export const toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

// Truncate text
export const truncateText = (text, maxLength = 50, suffix = "...") => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + suffix;
};

// Format order status
export const formatOrderStatus = (status) => {
  const statusMap = {
    pending: "Beklemede",
    processing: "İşleniyor",
    completed: "Tamamlandı",
    cancelled: "İptal Edildi",
    failed: "Başarısız",
  };

  return statusMap[status] || status;
};

// Format eSIM status
export const formatESIMStatus = (status) => {
  const statusMap = {
    active: "Aktif",
    inactive: "Pasif",
    expired: "Süresi Dolmuş",
    suspended: "Askıya Alındı",
    pending: "Beklemede",
  };

  return statusMap[status] || status;
};

import * as yup from "yup";

// Email validasyon şeması
export const emailSchema = yup
  .string()
  .email("Geçerli bir email adresi girin")
  .required("Email adresi zorunludur");

// Şifre validasyon şeması
export const passwordSchema = yup
  .string()
  .min(8, "Şifre en az 8 karakter olmalıdır")
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Şifre en az bir büyük harf, küçük harf ve rakam içermelidir"
  )
  .required("Şifre zorunludur");

// Telefon validasyon şeması
export const phoneSchema = yup
  .string()
  .matches(
    /^(\+90|0)?[5][0-9]{9}$/,
    "Geçerli bir Türkiye telefon numarası girin"
  )
  .required("Telefon numarası zorunludur");

// İsim validasyon şeması
export const nameSchema = yup
  .string()
  .min(2, "En az 2 karakter olmalıdır")
  .max(50, "En fazla 50 karakter olabilir")
  .matches(
    /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/,
    "Sadece harf ve boşluk kullanabilirsiniz"
  )
  .required("Bu alan zorunludur");

// Login validasyon şeması
export const loginValidationSchema = yup.object().shape({
  email: emailSchema,
  password: yup.string().required("Şifre zorunludur"),
});

// Register validasyon şeması
export const registerValidationSchema = yup.object().shape({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Şifreler eşleşmiyor")
    .required("Şifre tekrarı zorunludur"),
});

// Profil güncelleme validasyon şeması
export const profileUpdateSchema = yup.object().shape({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
});

// Şifre değiştirme validasyon şeması
export const changePasswordSchema = yup.object().shape({
  currentPassword: yup.string().required("Mevcut şifre zorunludur"),
  newPassword: passwordSchema,
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Şifreler eşleşmiyor")
    .required("Yeni şifre tekrarı zorunludur"),
});

// Kart bilgileri validasyon şeması
export const cardValidationSchema = yup.object().shape({
  cardNumber: yup
    .string()
    .matches(/^\d{16}$/, "Kart numarası 16 haneli olmalıdır")
    .required("Kart numarası zorunludur"),
  expiryDate: yup
    .string()
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "MM/YY formatında girin")
    .required("Son kullanma tarihi zorunludur"),
  cvv: yup
    .string()
    .matches(/^\d{3,4}$/, "CVV 3-4 haneli olmalıdır")
    .required("CVV zorunludur"),
  cardHolderName: yup
    .string()
    .min(2, "En az 2 karakter olmalıdır")
    .required("Kart sahibinin adı zorunludur"),
});

// Forgot password validasyon şeması
export const forgotPasswordSchema = yup.object().shape({
  email: emailSchema,
});

// Custom validatörler
export const validators = {
  // Kredi kartı numarası (Luhn algoritması)
  isValidCardNumber: (cardNumber) => {
    const cleanNumber = cardNumber.replace(/\s/g, "");
    if (!/^\d{16}$/.test(cleanNumber)) return false;

    let sum = 0;
    for (let i = 0; i < cleanNumber.length; i++) {
      let digit = parseInt(cleanNumber[i]);
      if (i % 2 === 0) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    return sum % 10 === 0;
  },

  // IBAN validasyonu
  isValidIBAN: (iban) => {
    const cleanIBAN = iban.replace(/\s/g, "").toUpperCase();
    if (!/^TR\d{24}$/.test(cleanIBAN)) return false;

    // IBAN mod-97 kontrolü
    const rearranged = cleanIBAN.slice(4) + cleanIBAN.slice(0, 4);
    const numericString = rearranged.replace(/[A-Z]/g, (char) =>
      (char.charCodeAt(0) - 55).toString()
    );

    let remainder = "";
    for (let i = 0; i < numericString.length; i++) {
      remainder = (remainder + numericString[i]) % 97;
    }

    return remainder === 1;
  },

  // ICCID validasyonu
  isValidICCID: (iccid) => {
    return /^\d{19,20}$/.test(iccid);
  },

  // QR kod validasyonu
  isValidQRCode: (qrData) => {
    // eSIM QR kodları genellikle LPA: ile başlar
    return typeof qrData === "string" && qrData.startsWith("LPA:");
  },

  // Güçlü şifre kontrolü
  isStrongPassword: (password) => {
    const checks = {
      length: password.length >= 8,
      upperCase: /[A-Z]/.test(password),
      lowerCase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const passedChecks = Object.values(checks).filter(Boolean).length;

    return {
      isValid: passedChecks >= 4,
      strength:
        passedChecks >= 5
          ? "very-strong"
          : passedChecks >= 4
          ? "strong"
          : passedChecks >= 3
          ? "medium"
          : "weak",
      checks,
    };
  },

  // Email format kontrolü
  isValidEmailFormat: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Telefon numarası formatı
  isValidPhoneFormat: (phone) => {
    const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  },

  // URL format kontrolü
  isValidURL: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Sayısal değer kontrolü
  isNumeric: (value) => {
    return !isNaN(value) && !isNaN(parseFloat(value));
  },

  // Boş string kontrolü
  isEmpty: (value) => {
    return !value || value.trim().length === 0;
  },

  // Minimum yaş kontrolü
  isValidAge: (birthDate, minAge = 18) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age >= minAge;
  },
};

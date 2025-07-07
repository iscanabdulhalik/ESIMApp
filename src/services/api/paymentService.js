import { post, get } from "./apiClient";
import { STRIPE_CONFIG } from "../../constants/api";

export const paymentService = {
  // Stripe payment intent oluştur
  createPaymentIntent: async (amount, currency = "USD", packageId) => {
    const response = await post("/payments/create-intent", {
      amount: Math.round(amount * 100), // Stripe cents cinsinden bekler
      currency,
      packageId,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return response;
  },

  // Ödemeyi onayla
  confirmPayment: async (paymentIntentId, paymentMethodId) => {
    const response = await post("/payments/confirm", {
      paymentIntentId,
      paymentMethodId,
    });

    return response;
  },

  // Ödeme geçmişini getir
  getPaymentHistory: async (page = 1, limit = 20) => {
    const response = await get("/payments/history", {
      page,
      limit,
    });

    return response;
  },

  // Ödeme detaylarını getir
  getPaymentDetails: async (paymentId) => {
    const response = await get(`/payments/${paymentId}`);
    return response;
  },

  // Kayıtlı ödeme yöntemlerini getir
  getPaymentMethods: async () => {
    const response = await get("/payments/methods");
    return response;
  },

  // Ödeme yöntemi ekle
  addPaymentMethod: async (paymentMethodId) => {
    const response = await post("/payments/methods", {
      paymentMethodId,
    });

    return response;
  },

  // Ödeme yöntemi sil
  removePaymentMethod: async (paymentMethodId) => {
    const response = await post(`/payments/methods/${paymentMethodId}/remove`);
    return response;
  },

  // Varsayılan ödeme yöntemi ayarla
  setDefaultPaymentMethod: async (paymentMethodId) => {
    const response = await post("/payments/methods/default", {
      paymentMethodId,
    });

    return response;
  },

  // Fatura oluştur
  createInvoice: async (orderData) => {
    const response = await post("/payments/invoice", orderData);
    return response;
  },

  // Faturaları listele
  getInvoices: async (page = 1, limit = 20) => {
    const response = await get("/payments/invoices", {
      page,
      limit,
    });

    return response;
  },

  // Fatura indir
  downloadInvoice: async (invoiceId) => {
    const response = await get(`/payments/invoices/${invoiceId}/download`);
    return response;
  },

  // İade talebi oluştur
  createRefund: async (paymentId, amount, reason) => {
    const response = await post("/payments/refund", {
      paymentId,
      amount: amount ? Math.round(amount * 100) : undefined,
      reason,
    });

    return response;
  },

  // İade durumunu kontrol et
  getRefundStatus: async (refundId) => {
    const response = await get(`/payments/refunds/${refundId}`);
    return response;
  },

  // Webhook'ları doğrula
  verifyWebhook: async (payload, signature) => {
    const response = await post("/payments/webhook/verify", {
      payload,
      signature,
    });

    return response;
  },
};

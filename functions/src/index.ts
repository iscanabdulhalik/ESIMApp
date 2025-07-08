import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import axios, {isAxiosError} from "axios";
admin.initializeApp();
const db = admin.firestore();
const ESIM_ACCESS_API_KEY = process.env.ESIM_KEY;
const ESIM_API_URL = "https://api.esimaccess.com/v1";
interface PurchaseData {
  packageId: string;
}
export const purchaseESIMPackage = onCall<PurchaseData>(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "Bu işlemi yapmak için giriş yapmalısınız."
    );
  }
  const {packageId} = request.data;
  if (!packageId) {
    throw new HttpsError(
      "invalid-argument",
      "Paket ID'si (`packageId`) sağlanmalıdır."
    );
  }
  const uid = request.auth.uid;
  try {
    logger.info(`Kullanıcı ${uid} için sipariş oluşturuluyor...`);
    const orderResponse = await axios.post(
      `${ESIM_API_URL}/orders`,
      {packageId, quantity: 1},
      {headers: {Authorization: `Bearer ${ESIM_ACCESS_API_KEY}`}}
    );
    const order = orderResponse.data;
    logger.info(`Sipariş ${order.id} başarıyla oluşturuldu.`);
    const esimDetailsResponse = await axios.get(
      `${ESIM_API_URL}/orders/${order.id}/esims`,
      {headers: {Authorization: `Bearer ${ESIM_ACCESS_API_KEY}`}}
    );
    const esim = esimDetailsResponse.data[0];
    if (!esim) {
      throw new Error("Sipariş sonrası eSIM detayları alınamadı.");
    }
    logger.info(`eSIM ${esim.iccid} detayları başarıyla alındı.`);
    const userESIMRef = db
      .collection("users")
      .doc(uid)
      .collection("esims")
      .doc(esim.iccid);
    await userESIMRef.set({
      ...esim,
      orderId: order.id,
      packageId,
      purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: "ACTIVE",
    });
    logger.info(
      `eSIM ${esim.iccid}, kullanıcı ${uid} için Firestore'a kaydedildi.`
    );
    return {success: true, esim: {id: userESIMRef.id, ...esim}};
  } catch (error: unknown) {
    logger.error(
      `Kullanıcı ${uid} için eSIM satın alınırken hata oluştu:`,
      error
    );
    if (isAxiosError(error)) {
      logger.error("Axios Hata Detayları:", error.response?.data);
    }
    throw new HttpsError(
      "internal",
      "eSIM satın alınırken sunucu tarafında bir hata oluştu."
    );
  }
});

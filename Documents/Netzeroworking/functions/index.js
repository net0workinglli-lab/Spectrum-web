/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.redirectCard = functions.https.onRequest(async (req, res) => {
  const cardId = req.path.split("/").pop(); // Lấy phần cuối của /u/xxx

  try {
    const doc = await admin.firestore().collection("activation_codes").doc(cardId).get();

    if (!doc.exists) {
      return res.status(404).send("Không tìm thấy mã thẻ.");
    }

    const data = doc.data();
    if (!data.uid) {
      return res.status(400).send("Thẻ chưa được kích hoạt.");
    }

    return res.redirect(302, `/vcard.html?uid=${data.uid}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi server.");
  }
});

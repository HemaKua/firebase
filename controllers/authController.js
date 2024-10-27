// authController.js

const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

exports.verifyPhoneNumber = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Create a custom token
    const customToken = await firebaseAdmin.auth().createCustomToken(phoneNumber);

    // Send the custom token to the client
    res.json({ success: true, customToken });
  } catch (error) {
    console.error('Error generating custom token:', error);
    res.status(500).json({ success: false, message: `Failed to generate custom token: ${error.message}` });
  }
};

const admin = require('firebase-admin');
const express = require('express');

const serviceAccount = require('./serviceAccountKey'); 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const port = 3000;

app.use(express.json());

const sendOTP = async (phoneNumber) => {
  try {
    const settings = {
      phoneNumber: phoneNumber
    };
    const verificationResult = await admin.auth().createPhoneVerification(settings);
    return verificationResult;
  } catch (error) {
    throw error;
  }
};

app.post('/sendOTP', async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    const verificationResult = await sendOTP(phoneNumber);
    console.log('Verification result:', verificationResult);
    res.json({ success: true, message: 'OTP sent successfully', verificationResult });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error sending OTP', message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const otpGenerator = require('otp-generator');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

app.post('/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }

  // Generate OTP
  const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

  const msgOptions = {
    from: process.env.TWILIO_FROM_NUMBER,
    to: phoneNumber,
    body: `Your OTP is: ${otp}`,
  };

  try {
    // Send SMS
    await client.messages.create(msgOptions);
    console.log(`OTP sent to ${phoneNumber}`);
    return res.status(200).json({ success: true, message: 'OTP sent successfully.' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    return res.status(500).json({ error: 'Failed to send OTP.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

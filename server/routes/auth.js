const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);

// ─── Google OAuth ──────────────────────────────────────────────────
router.post('/google', async (req, res) => {
    const { token: googleToken } = req.body;

    if (!googleToken) {
        return res.status(400).json({ error: 'No token provided' });
    }

    try {
        let googleId, email, name, profilePicture;

        // ID Token (JWT — has dots): verify via Google Auth Library
        if (googleToken.split('.').length === 3) {
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            googleId = payload.sub;
            email = payload.email;
            name = payload.name;
            profilePicture = payload.picture;
        } else {
            // Access Token: fetch userinfo from Google
            const userInfoRes = await axios.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                { headers: { Authorization: `Bearer ${googleToken}` } }
            );
            googleId = userInfoRes.data.sub;
            email = userInfoRes.data.email;
            name = userInfoRes.data.name;
            profilePicture = userInfoRes.data.picture;
        }

        if (!email) {
            return res.status(400).json({ error: 'Google account has no email' });
        }

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ name, email, googleId, profilePicture });
            await user.save();
        } else if (!user.googleId) {
            user.googleId = googleId;
            if (!user.profilePicture) user.profilePicture = profilePicture;
            await user.save();
        }

        const jwtToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '7d' }
        );

        res.json({ token: jwtToken, user });
    } catch (err) {
        console.error('Google Auth Error:', err.response?.data || err.message);
        res.status(500).json({ error: 'Google authentication failed', details: err.message });
    }
});

module.exports = router;

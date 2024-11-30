const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AzureStrategy = require('passport-azure-ad').OIDCStrategy;
require('dotenv').config();
const app = express();
const PORT = 3000;

// Mock user database
const users = [];

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'))
app.use(passport.initialize());

// Hash password (12 salt rounds for bcrypt)
async function hashPassword(password) {
    return await bcrypt.hash(password, 12);
}

// Verify password
async function verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
}));

// passport.use(new AzureStrategy({
//     clientID: process.env.MICROSOFT_CLIENT_ID,
//     clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
//     callbackURL: '/auth/microsoft/callback',
//     responseType: 'code',
//     responseMode: 'query',
//     scope: ['openid', 'profile', 'email'],
// }, (accessToken, refreshToken, profile, done) => {
//     done(null, profile);
// }));

// Login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) return res.status(400).json({ success: false, message: 'User not found' });

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) return res.status(400).json({ success: false, message: 'Invalid password' });

    const token = jwt.sign({ email: user.email }, 'SECRET_KEY', { expiresIn: '1h' });
    res.json({ success: true, token });
});

// Google OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
}));

// Microsoft OAuth routes
app.get('/auth/microsoft', passport.authenticate('azuread-openidconnect'));
app.post('/auth/microsoft/callback', passport.authenticate('azuread-openidconnect', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
}));

// Create user
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    if (users.some(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);
    users.push({ email, password: hashedPassword });
    res.json({ success: true, message: 'User registered successfully' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

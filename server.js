const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mysql = require('mysql2');
const path = require('path');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const OPTIONS = {
    root: path.join(__dirname)
};

// MySQL connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'))

// Hash password (12 salt rounds for bcrypt)
async function hashPassword(password) {
    return await bcrypt.hash(password, 12);
}

// Verify password
async function verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

// Without middleware
app.get('/', function (req, res) {

    const fileName = 'public/index.html';
    res.sendFile(fileName, OPTIONS, function (err) {
        if (err) {
            console.error('Error sending file:', err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});

// Middleware to protect routes
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ success: false, message: 'Access Denied: No Token Provided' });

    const bearerToken = token.split(' ')[1];
    jwt.verify(bearerToken, process.env.JWT_SECRET || 'SECRET_KEY', (err, user) => {
        if (err) return res.status(403).json({ success: false, message: 'Access Denied: Invalid Token' });
        req.user = user;
        next();
    });
}

// User registration
app.post('/api/register', async (req, res) => {
    console.log(JSON.stringify(req.body))
    const { firstName, surname, email, password, passwordVerification, company } = req.body;

    // Check if passwords match
    if (password !== passwordVerification) {
        return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    try {

        const hashedPassword = await hashPassword(password);

        // Insert user into the database
        db.query(
            'INSERT INTO users (first_name, surname, email, password, company) VALUES (?, ?, ?, ?, ?)',
            [firstName, surname, email, hashedPassword, company],
            (err, results) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({ success: false, message: 'User already exists' });
                    }
                    console.error(err);
                    return res.status(500).json({ success: false, message: 'Internal Server Error' });
                }
                res.json({ success: true, message: 'User registered successfully', userId: results.insertId });
            }
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


// User login
app.get('/login', authenticateToken, async (req, res) => {
    const fileName = 'public/login.html';
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.error('Error sending file:', err);
        } else {
            console.log('Sent:', fileName);
        }
    });
})
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Retrieve user from database
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }

            if (results.length === 0) {
                return res.status(400).json({ success: false, message: 'User not found' });
            }

            const user = results[0];
            const isValid = await verifyPassword(password, user.password);
            if (!isValid) {
                return res.status(400).json({ success: false, message: 'Invalid password' });
            }

            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET || 'SECRET_KEY', { expiresIn: '1h' });
            res.json({ success: true, token });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: '/auth/google/callback',
// }, (accessToken, refreshToken, profile, done) => {
//     const email = profile.emails[0].value;

//     // Check if user exists
//     db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
//         if (err) {
//             return done(err);
//         }
//         if (results.length > 0) {
//             // User exists, proceed with login
//             return done(null, results[0]);
//         } else {
//             // Redirect to registration with email pre-filled
//             return done(null, false, { message: `/register?email=${email}` });
//         }
//     });
// }));

// Handle Google OAuth callback
app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/',
    failureMessage: true,
}), (req, res) => {
    // Check for custom redirect in the failure message
    if (req.authInfo && req.authInfo.message) {
        return res.redirect(req.authInfo.message);
    }

    // Successful login
    res.redirect('/dashboard');
});


// Protected route
app.get('/dashboard', authenticateToken, (req, res) => {
    res.json({ success: true, message: `Welcome to your dashboard, ${req.user.email}!` });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

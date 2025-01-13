const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const OPTIONS = {
    root: path.join(__dirname, 'public')
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
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration for local strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return done(err);
        if (results.length === 0) {
            return done(null, false, { message: 'Incorrect email.' });
        }

        const user = results[0];
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
    });
}));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "default",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    // Find or create user in the database
    db.query('SELECT * FROM users WHERE google_id = ?', [profile.id], (err, results) => {
        if (err) return done(err);
        if (results.length > 0) {
            return done(null, results[0]);
        } else {
            const newUser = {
                google_id: profile.id,
                email: profile.emails[0].value,
                first_name: profile.name.givenName,
                last_name: profile.name.familyName
            };
            db.query('INSERT INTO users SET ?', newUser, (err, results) => {
                if (err) return done(err);
                newUser.id = results.insertId;
                return done(null, newUser);
            });
        }
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM users WHERE email = ?', [id], (err, results) => {
        if (err) return done(err);
        done(null, results[0]);
    });
});

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Routes
app.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.sendFile('login.html', OPTIONS);
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}));

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/dashboard');
    }
);

app.get('/dashboard', isAuthenticated, (req, res) => {
    res.json({ success: true, message: `Welcome to your dashboard, ${req.user.email}!` });
});

app.get('/events', async (req, res) => {
    let result;
    try {
        result = await this.db.query(
            `SELECT * FROM EVENTS WHERE guildId = ? ORDER BY date`,
            ["1304780977226252340"]);
    } catch (ex) {
        console.log(`Error when inserting into members with ${ex}`)
    }

    res.json({ success: true, data: result })
})

// Registration route
app.get('/api/register', (req, res) => {
    res.sendFile('registration.html', OPTIONS);
});

app.post('/api/register', async (req, res, next) => {
    const { firstName, surname, email, password, company } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if company exists
        db.query('SELECT * FROM company WHERE companyname = ?', [company], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }

            let companyId;
            if (results.length > 0) {
                companyId = results[0].companyid;
            } else {
                // Insert new company
                db.query('INSERT INTO company (companyname) VALUES (?)', [company], (err, results) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ success: false, message: 'Internal Server Error' });
                    }
                    companyId = results.insertId;
                });
            }

            // Insert new user
            const newUser = {
                first_name: firstName,
                last_name: surname,
                email: email,
                password: hashedPassword,
                companyid: companyId,
                registration_date: new Date()
            };

            db.query('INSERT INTO users SET ?', newUser, (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ success: false, message: 'Internal Server Error' });
                }

                // Authenticate the user after registration
                req.login(newUser, (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ success: false, message: 'Internal Server Error' });
                    }
                    res.redirect('/dashboard');
                });
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const app = express();

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: '308002036236-oj0v7jf5upetckbcq7mg7phodjkoh0um.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
}));

passport.serializeUser(function(user, done) {done(null, user);});
passport.deserializeUser(function(user, done) {done(null, user);});

app.get('/login', (req, res) => {res.send(`<html><body><a href="/auth/google">Auth</a></body></html>`);})
    .get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt:'select_account'}))
    .get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', successRedirect: '/resource' }))
    .get('/resource', (req, res) => {
        if (req.isAuthenticated()) {
            res.status(200).send('RESOURCE' + req.user._raw);
        } else {res.redirect('/login');}
    })
    .get('/logout', function(req, res, next) {
        req.logout(function(err) {
            if (err) { return err; }
            res.redirect('/login');
        });
    })


app.use((req, res) => {res.status(404).send('ERROR 404: not found');});
app.listen(3000);
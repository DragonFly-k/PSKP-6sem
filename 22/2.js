const express = require('express');
const {DigestStrategy} = require('passport-http');
const Users = require('./user');
const session = require('express-session');
const passport = require("passport");
const app = express();

passport.use('digest', new DigestStrategy(
    {qop: 'auth'},
    (username, done) => {
        const user = Users.find(user => user.username === username);
        if (user) {return done(null, user, user.password);}
        return done(null, false);
    }
));

app.use(passport.initialize({}));

app.use(session({
    secret: 'cookie_secret',
    resave: false,
    saveUninitialized: false
}));

app.get('/login',
        (req, res, next) => {
            if (req.session.logout && req.headers.authorization) {
                req.session.logout = false;
                delete req.headers.authorization;
            }
            next();
        }, passport.authenticate('digest', {session: false}),
            (req, res) => {res.json(req.user.username);})
    .get('/logout', (req, res) => {
        req.session.logout = true;
        res.redirect('/login');
    })
    .get('/resource',
        passport.authenticate('digest', {session: false, failureRedirect: "/login"}),
        (req, res) => {
            res.send('RESOURCE');
        }
    );

app.use((req, res) => {
    res.status(404).send('Not found');
});

app.listen(3000);
const express = require('express');
const {BasicStrategy} = require('passport-http');
let Users =  require("./user.json")
const session = require('express-session');
const passport = require("passport");
const app = express();

passport.use('basic', new BasicStrategy ((username, password, done) => {
    const user = Users.find(user => user.username === username && user.password === password);
    return done(null, user ? user : false);
}));

app.use(passport.initialize({}));

app.use(session({
    secret: 'cookie_secret',
    resave: false,
    saveUninitialized: false
}));

app.get('/login',(req, res, next) => {
        if (req.session.logout && req.headers.authorization) {
            req.session.logout = false;
            delete req.headers.authorization;
        }
        next();
    }, passport.authenticate('basic', {session: false}),
        (req, res) => {res.json(req.user.username)})
    .get('/logout', (req, res) => {
        req.session.logout = true;
        res.redirect('/login');
    })
    .get('/resource',passport.authenticate('basic', {session: false, failureRedirect: "/login"}),
        (req, res) => {res.send('RESOURCE');
    });

app.use((req, res) => {
    res.status(404).send('Not found');
});
app.listen(3000);
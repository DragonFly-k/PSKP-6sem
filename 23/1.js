const express = require('express');
const session = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const users = require('./user.json');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {done(null, user)});
passport.deserializeUser((user, done) => {done(null, user)});

passport.use(new localStrategy((username, password, done) => {
    const index = users.findIndex(e => e.username === username);
    if (index === -1) 
        return done(null, false, { message: 'User not found' });

    const user = users[index];
    if (user.password !== password) 
        return done(null, false, { message: 'Incorrect password' });

    return done(null, user);
}));

app.get('/auth/login', (req, res) => {
        res.sendFile(__dirname + '/login.html');
    })
    .post('/auth/login', (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.status(401).send("Unauthorithed");
        
            req.logIn(user, (err) => {
                if (err) return next(err);
                return res.redirect('/resource');
            });
        })(req, res, next);
    })
    .get('/resource', (req, res) => {
        if (req.isAuthenticated()) 
            return res.end(`Resource owned by ${req.user.username}`);
        res.redirect('/auth/login');
    })
    .get('/logout', (req, res, next) => {
        req.logOut((err) => {
            if (err) {next(err)}
            res.redirect('/auth/login')
        })
    })    

app.use((req, res) => {res.status(404).send('Not found');});
app.listen(3000, () => {console.log(`Server started at http://localhost:3000`);});
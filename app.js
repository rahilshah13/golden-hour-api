const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { redisClient } = require('./helpers/redis');
const { pool } = require('./helpers/db');
require('./helpers/passport');

// create app and add middleware
const app = express();
app.use(session({secret: 'cats'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('<a href="/auth/google"> auth with google </a>');
});

app.get('/auth/google', passport.authenticate('google', {scope: ['email', 'profile']}));
app.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    successRedirect: '/protected' 
}));

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

app.get('/auth/failure', isLoggedIn, (req, res) => {
    res.send("something went wrong!");
});

app.get('/protected', (req, res) => {
    console.log(req.user);
    res.send(`\
        <div>
            <img src="${req.user.photos[0].value}" alt="pfp" width="50" height="50">
            YELLOW ${req.user.email}!
        </div>
    `);
});

app.get('/logout', async (req, res) => {
    req.logout();
    req.session.destroy();
    res.send("goodbye xD!");
});

app.listen(3000, () => console.log("listening on port 3000."));

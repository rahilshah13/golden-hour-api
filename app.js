const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { redisClient } = require('./helpers/redisHelper');
const { pool } = require('./helpers/db');
require('./helpers/passport');

// create app and add middleware
const app = express();
app.use(session({secret: 'cats'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

app.get('/api/', (req, res) => {
    res.send('<a href="api/auth/google"> auth with google </a>');
});

app.get('api/auth/google', passport.authenticate('google', {scope: ['email', 'profile']}));

app.get('api/google/callback', passport.authenticate('google', {
    failureRedirect: 'https://devoid.life/api/auth/failure',
    successRedirect: 'https://devoid.life/api/protected' 
}));


function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

app.get('api/auth/failure', isLoggedIn, (req, res) => {
    res.send("something went wrong!");
});

app.get('api/protected', (req, res) => {
    console.log(req.user);
    res.send(`\
        <div>
            <img src="${req.user.photos[0].value}" alt="pfp" width="50" height="50">
            YELLOW ${req.user.email}!
        </div>
    `);
});

app.get('api/logout', async (req, res) => {
    req.logout();
    req.session.destroy();
    res.send("goodbye xD!");
});

app.listen(5000, () => console.log("listening on port 5000."));

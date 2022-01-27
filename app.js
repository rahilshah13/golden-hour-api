const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const config = require('./config/googleOAuth.json');
const { OAuth2Client } = require('google-auth-library');
//const { redisClient } = require('./helpers/redisHelper');
//const { pool } = require('./helpers/db');

// create app and add middleware
const app = express();
app.use(session({secret: 'cats'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({origin:true,credentials: true}));
app.use(express.json());
app.authClient = new OAuth2Client(config.web.client_id, config.web.client_secret);

app.post('/api/auth/login', async (req, res) => {
    const token = req.body.tokenId;
    const result = await req.app.authClient.verifyIdToken({
        idToken: token, 
        audience: config.web.client_id 
    });
    // TODO VERIFY HOSTED DOMAIN
    console.log(result);
    res.status(200).send(`${req.body}`);
});

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

app.get('api/auth/logout', async (req, res) => {
    req.logout();
    req.session.destroy();
    res.send("goodbye xD!");
});

app.listen(5000, () => console.log("listening on port 5000."));

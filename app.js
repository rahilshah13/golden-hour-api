const express = require('express');
const cors = require('cors');
const config = require('./config/googleOAuth.json');
const { OAuth2Client } = require('google-auth-library');
//const { redisClient } = require('./helpers/redisHelper');
//const { pool } = require('./helpers/db');

// create app and add middleware
const app = express();
app.use(cors({origin:true, credentials: true}));
app.use(express.json());
app.authClient = new OAuth2Client(config.web.client_id, config.web.client_secret);

app.post('/api/auth/login', async (req, res) => {
    const token = req.body.tokenId;
    const result = await req.app.authClient.verifyIdToken({
        idToken: token, 
        audience: config.web.client_id 
    }).catch(e => console.log("Invalid Token."));

    if (!result || result.payload.hd != 'vt.edu') 
        return res.status(401).send("Unauthorized. Login with vt.edu email.")

    user = { pid: result.payload.email.split("@")[0], name: result.payload.given_name, pic: result.payload.picture, gender: null, gender_seeking: null, interactions: [] }

    // client is responsible for setting Auth header upon recieving this response
    return res.status(200).send(`${{...user, token: token}}`);
});

function isLoggedIn(req, res, next) {
    const result = await req.app.authClient.verifyIdToken({
        idToken: token, 
        audience: config.web.client_id 
    }).catch(e => console.log("Invalid Token."));
    result ? next() : res.sendStatus(401);
}

app.get('api/auth/logout', isLoggedIn, async (req, res) => {
    res.status(200).send("goodbye xD!");
});

app.listen(5000, () => console.log("listening on port 5000."));

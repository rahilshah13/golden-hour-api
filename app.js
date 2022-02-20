const express = require('express');
const cors = require('cors');
const config = require('./config/googleOAuth.json');
const { OAuth2Client } = require('google-auth-library');
//const { redisClient } = require('./services/redisService');
//const { pool } = require('./services/db');

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

    console.log(result);
    user = { pid: result.payload.email.split("@")[0], name: result.payload.given_name, pic: result.payload.picture, token: token}
    
    // TODO: Expire Cookie?
    res.setHeader("Set-Cookie", `token=${token}; HttpOnly`);
    // client is responsible for setting Auth header upon recieving this response
    return res.status(200).send(user);
});

async function isLoggedIn(req, res, next) {
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
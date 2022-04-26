const express = require('express');
const cors = require('cors');
const config = require('./config/googleOAuth.json');
const { OAuth2Client } = require('google-auth-library');
//const { redisClient } = require('./services/redisService');
const { pool } = require('./services/db');
const { parseInputDatesAsUTC } = require('pg/lib/defaults');

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

    // if (!result || result.payload.hd != 'vt.edu') 
    //     return res.status(401).send("Unauthorized. Login with vt.edu email.")
    user = { pid: result.payload.email.split("@")[0], name: result.payload.given_name, pic: result.payload.picture, token: token}
    
    // TODO: Expire Cookie?
    res.setHeader("Set-Cookie", `token=${token}; HttpOnly`);
    // client is responsible for setting Auth header upon recieving this response
    return res.status(200).send(user);
});

app.post('/api/admin/add', async (req, res) => { 
    const admin = req.body.admin;
    if (admin == "" || admin === null || admin === undefined) {
        res.status(400).send('Missing required fields.');

    } else {
        const result = await pool.query('INSERT INTO admins(email) VALUES ($1)', [admin]);
        admins = await pool.query('SELECT * FROM admins');
        res.status(200).send({"admins": admins.rows});
    }
});

app.post('/api/admin/delete', async (req, res) => {
    const admin = req.body.admin;
    if (admin == "" || admin === null || admin === undefined) {
        res.status(400).send('Missing required fields.'); 

    } else {
        const result = await pool.query('DELETE FROM admins WHERE email = $1', [admin]);
        if (result.rowCount === 0) {
            res.status(404).send('Admin not found.');
        } else{
            admins = await pool.query('SELECT * FROM admins');
            res.status(200).send({"admins": admins.rows});
        }
    }
});

app.get('/api/isAdmin', async (req, res) => {
    
    if(!req.headers['authorization'])
        return res.status(404).send('not found.');

    const token = req.headers['authorization'].split(' ')[1];
    const result = await req.app.authClient.verifyIdToken({
        idToken: token, 
        audience: config.web.client_id 
    }).catch(e => console.log("Invalid Token."));

    const user = await pool.query('SELECT * FROM admins WHERE email=$1', [result.payload.email]);
    
    if (user.rows.length === 0) {
        return res.status(404).send('not an found.');
    }
    else {
        const admins = await pool.query('SELECT * FROM admins');
        const events = await pool.query('SELECT * FROM gh_events');
        const users = await pool.query('SELECT * FROM users');
        const ia = await pool.query('SELECT * FROM interactions');
        const ial = ia.rows.filter(x => x.outcome === 'left');
        const iar = ia.rows.filter(x => x.outcome === 'right');

        return res.status(200).send({
            users: {n: users.rows.length, avg_age: users.rows.reduce((a, b) => a + b.age, 0) / users.rows.length, avg_gender: users.rows.reduce((a, b) => a + parseFloat(b.gender), 0) / users.rows.length},
            events: {n: events.rows.length},
            interactions: {n: ia.rows.length, 
                            nl: ial.length, 
                            nr: iar.length, 
                            avg_dl: ial.reduce((a, b) => a + parseFloat(b.duration), 0) / ial.length,
                            avg_rl: iar.reduce((a, b) => a + parseFloat(b.duration), 0) / iar.length
            },
            "admins": admins.rows
        });
    }
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
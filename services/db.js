const Pool = require('pg').Pool;
const { faker } = require('@faker-js/faker');
const {floor, random} = Math;

// docker run --name pgadmin -p 8080:80 --link db -e PGADMIN_DEFAULT_EMAIL=rahil@vt.edu -e PGADMIN_DEFAULT_PASSWORD=goldenhour -d dpage/pgadmin4
const pool = new Pool({
    user: process.env.POSTGRES_USER || 'goldenhour',
    host: process.env.DB_HOST ||'localhost',
    database: process.env.POSTGRES_DB || 'goldenhour',
    password: process.env.POSTGRES_PASSWORD || 'goldenhour',
    port: 5432
});

const create_admin_table = `CREATE TABLE IF NOT EXISTS admins(
    ID SERIAL PRIMARY KEY,
    email FOREIGN KEY REFERENCES users(email)
)`;

const create_users_table = `CREATE TABLE IF NOT EXISTS users(
    ID SERIAL,
    email TEXT PRIMARY KEY,
    gender DECIMAL,
    age INT,
    preference_l DECIMAL,
    preference_h DECIMAL,
    session_state TEXT
)`;

const create_events_table = `CREATE TABLE IF NOT EXISTS gh_events(
    ID SERIAL PRIMARY KEY,
    start_time TEXT,
    end_time TEXT,
    creator_id INT
)`;


const create_interactions_table = `CREATE TABLE IF NOT EXISTS interactions(
    ID SERIAL PRIMARY KEY,
    outcome TEXT,
    duration NUMERIC
)`;

const create_participants_table = `CREATE TABLE IF NOT EXISTS participants(
    ID SERIAL PRIMARY KEY,
    interaction_id INT,
    participant_1_email TEXT,
    participant_2_email TEXT
)`;

const insert_admin = `INSERT INTO admins(email) VALUES($1)`;
const insert_user = `INSERT INTO users(email, gender, age, preference_l, preference_h, session_state) VALUES($1, $2, $3, $4, $5, $6)`;
const insert_event = `INSERT INTO gh_events(start_time, end_time, creator_id) VALUES($1, $2, $3)`;
const insert_interactions = `INSERT INTO interactions(outcome, duration) VALUES($1, $2)`;
const insert_particpants = `INSERT INTO participants(interaction_id, participant_1_email, participant_2_email) VALUES($1, $2, $3)`;

async function initTables() {
    // create tables
    await pool.query(create_users_table).catch(err => console.log("table exists."));
    await pool.query(create_admin_table).catch(err => console.log("table exists."));
    await pool.query(create_events_table).catch(err => console.log(err));
    await pool.query(create_interactions_table).catch(err => console.log(err));
    await pool.query(create_participants_table).catch(err => console.log(err));
    
    // insert admins
    await pool.query(insert_admin, ["rahil@vt.edu"]).catch(err => console.log("key exists."));
    await pool.query(insert_admin, ["scdrake19@vt.edu"]).catch(err => console.log("key exists."));
    await pool.query(insert_admin, ["aribali3@vt.edu"]).catch(err => console.log("key exists."));

    // populate users table
    // var users = [];
    // for(let i = 0; i < 100; i++) {
    //     let e = faker.name.firstName() + "@vt.edu", g = random(), a=floor(random()*10 + 18), pl = Math.random() / 2, ph = pl * 2;
    //     users.push(e);
    //     //await pool.query(insert_user, [e, g, a, pl, ph, "not_ready"]).catch(e=> console.log(e));
    // }
        
    // // populate events table
    // let start = new Date(), admins = ["aribali3@vt.edu", "scdrake19@vt.edu", "rahil@vt.edu"];
    // for (let i=0; i<20; i++) {
    //     let end = new Date(start.getTime() + (1000 * 60 * 60));
    //     await pool.query(insert_event, [start.toString(), end.toString(), (i%3) + 1]).catch(e=> console.log(e));
    //     start = new Date(start.getTime() + (1000 * 60 * 60 * 24 * 7));
    // }

    // // populate interactions and participants table
    // for (let i=1; i <= 100; i++) {
    //     let e1 = users[floor(random() * users.length)], e2 = users[floor(random() * users.length)];
    //     await pool.query(insert_interactions, [i%2 == 0 ? "right" : "left", random()*10+1]).catch(e=> console.log(e));
    //     await pool.query(insert_particpants, [i, e1, e2]).catch(e=> console.log(e));
    // }
}

(async () => await initTables())();

module.exports = {
  pool
};
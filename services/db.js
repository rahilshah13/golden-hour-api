const Pool = require('pg').Pool;


// docker run --name pgadmin -p 8080:80 --link db -e PGADMIN_DEFAULT_EMAIL=rahil@vt.edu -e PGADMIN_DEFAULT_PASSWORD=goldenhour -d dpage/pgadmin4
const pool = new Pool({
    user: process.env.POSTGRES_USER || 'goldenhour',
    host: process.env.DB_HOST ||'localhost',
    database: process.env.POSTGRES_DB || 'goldenhour',
    password: process.env.POSTGRES_PASSWORD || 'goldenhour',
    port: 5432
});

const create_admin_table = `CREATE TABLE IF NOT EXISTS admins(
    ID SERIAL,
    email TEXT PRIMARY KEY
)`;

const create_events_table = `CREATE TABLE IF NOT EXISTS events(
    ID SERIAL PRIMARY KEY,
    start_datetime TEXT,
    max_participants INTEGER
)`;

const create_participants_table = `CREATE TABLE IF NOT EXISTS participants()`;


const test_content = `INSERT INTO admins(email) VALUES($1)`;

async function initTables() {
    await pool.query(create_admin_table).catch(err => console.log("table exists."));
    await pool.query(create_events_table).catch(err => console.log("table exists."));
    await pool.query(test_content, ["rahil@vt.edu"]).catch(err => console.log("key exists."));
    await pool.query(test_content, ["scdrake19@vt.edu"]).catch(err => console.log("key exists."));
    await pool.query(test_content, ["aribali3@vt.edu"]).catch(err => console.log("key exists."));
}

(async () => await initTables())();

module.exports = {
  pool
};
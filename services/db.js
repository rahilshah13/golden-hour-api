const Pool = require('pg').Pool;

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.DB_HOST ||'localhost',
    database: process.env.POSTGRES_DB || 'celery',
    password: process.env.POSTGRES_PASSWORD || 'anniebad69',
    port: 5432
});

const create_user_table = `CREATE TABLE IF NOT EXISTS users(
    ID SERIAL,
    pid TEXT PRIMARY KEY,
    pfp TEXT NOT NULL
)`;

const test_content = `INSERT INTO users(pid, pfp) VALUES($1,$2)`;

async function initTables() {
    await pool.query(create_user_table).catch(err => console.log(err));
    await pool.query(test_content, ["rahil", "http://www.google.com"]).catch(err => console.log(err));
}

(async () => await initTables())();

module.exports = {
  pool
};
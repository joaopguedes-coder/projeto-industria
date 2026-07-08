const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "projeto-industria",
    password: "senai",
    port: 5432
});

module.exports = pool;
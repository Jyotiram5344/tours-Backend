const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const dbUrl = new URL(process.env.MYSQL_URL);

const db = mysql.createConnection({
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  port: dbUrl.port,
  database: dbUrl.pathname.replace("/", ""),
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB connection failed:", err.message);
  } else {
    console.log("✅ Connected to Railway MySQL");
  }
});

module.exports = db;

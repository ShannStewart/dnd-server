require('dotenv').config();

const postString = process.env.DATABASE_URL;

module.exports = {
  "migrationDirectory": "migrations",
  "driver": "pg",
  "connectionString": postString
  //"host": process.env.MIGRATION_DB_HOST,
  //"port": process.env.MIGRATION_DB_PORT,
  //"database": process.env.MIGRATION_DB_NAME,
  //"username": process.env.MIGRATION_DB_USER,
  //"password": process.env.MIGRATION_DB_PASS
}
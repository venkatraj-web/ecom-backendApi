require('dotenv').config();

module.exports = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    dialect: process.env.DB_CONNECTION,
    DB: process.env.DB_DATABASE,
    pool: {
        min: 0,
        max: 5,
        acquire: 30000,
        idle: 10000
    }
}
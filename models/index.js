const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../configs/dbConfig');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        idle: dbConfig.pool.idle,
        acquire: dbConfig.pool.acquire,
    }
});

sequelize.authenticate().then(() => {
    console.log('Database authentication successful');
}).catch(err => {
    console.error("unable to authenticate: " + err.message);
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model")(sequelize, DataTypes);
db.roles = require("./role.model")(sequelize, DataTypes);
db.otps = require("./otp.model")(sequelize, DataTypes);
db.passwordResets = require("./passwordReset.model")(sequelize, DataTypes);
db.loginOtps = require("./loginOtp.model")(sequelize, DataTypes);
// db.roles.hasOne(db.users);

db.roles.hasMany(db.users, { foreignKey: 'roleId', as: 'user' });
db.users.belongsTo(db.roles, { foreignKey: 'roleId', as: 'role' });

// db.users.belongsToMany(db.roles, { through: "UserRole"});
// db.roles.belongsToMany(db.users, { through: "UserRole" });

db.sequelize.sync({alter: false, force: false}).then(() => {
    console.log('Database sync successfull');
}).catch(err => {
    console.error("unable to sync: " + err.message);
});

module.exports = db;
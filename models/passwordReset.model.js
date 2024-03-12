
module.exports = (sequelize, DataTypes) => {
    const PasswordReset = sequelize.define("password_resets", {
        userId: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    return PasswordReset;
}
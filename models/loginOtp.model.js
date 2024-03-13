module.exports = (sequelize, DataTypes) => {
    const LoginOTP = sequelize.define('login_otps', {
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: false,
        },
        otp: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    });

    return LoginOTP;
}
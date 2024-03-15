module.exports = (sequelize, DataTypes) => {
    const MobileOTP = sequelize.define('mobile_otps', {
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            autoIncrement: false,
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    });

    return MobileOTP;
}
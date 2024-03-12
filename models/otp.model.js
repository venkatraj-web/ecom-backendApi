

module.exports = (sequelize, DataTypes) => {
    const OTP = sequelize.define("otp", {
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: false,
        },
        otp: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });
    return OTP;
}
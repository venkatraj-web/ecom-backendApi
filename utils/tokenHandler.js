const jwt = require("jsonwebtoken");

const generateAccessToken = async (user) => {
    const token = await jwt.sign(
        {
            id: user.id,
            name: user.firstName,
            role: user.role,
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );

    return token;
}

module.exports = generateAccessToken;
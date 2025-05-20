const jwt = require('jsonwebtoken');


const verifyJWT = async (req, res, next) => {
    const token = req.cookies.AccessToken;

    if (!token) return res.status(401).json({ Message: "Token not found" });

    const user = jwt.verify(token, process.env.JWT_SECURITY_KEY, async (error, decoded) => {
        if (error) return res.status(401).json({ success: false, Message: "Unauthorized" });

        req.user = decoded;
        next()
    });
}

module.exports = verifyJWT;
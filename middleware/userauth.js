const jwt = require('jsonwebtoken');
const userJWT_SECRET = process.env.USER_JWT_SECRET; 


function authuser(req, res, next) {
    const token = req.headers.token;
    
    if (!token) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    try {
        const decoded = jwt.verify(token, userJWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(403).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = {
    authuser,
    userJWT_SECRET
}
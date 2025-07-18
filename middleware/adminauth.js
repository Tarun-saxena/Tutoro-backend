const jwt = require('jsonwebtoken'); 
const adminJWT_SECRET = process.env.ADMIN_JWT_SECRET;

function authadmin(req, res, next) {
    const token = req.headers.token;
    
    if (!token) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    try {
        const decoded = jwt.verify(token, adminJWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(403).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = {
    authadmin,
    adminJWT_SECRET
}
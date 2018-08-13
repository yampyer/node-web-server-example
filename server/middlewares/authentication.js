const jwt = require('jsonwebtoken');

let verifyToken = (req, res, next) => {
    let token = req.get('Authorization');

    jwt.verify(token, process.env.SECRET_SEED, (error, decoded) => {
        if (error) {
            return res.status(401).json({
                ok: false,
                error: {
                    message: 'Invalid token'
                }
            });
        }

        req.user = decoded.user;
        next();
    });
};

let verifyAdminRole = (req, res, next) => {
    let user = req.user;

    if (user.role !== 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            error: {
                message: 'User is not an admin'
            }
        });
    }

    next();
};

module.exports = {
    verifyToken,
    verifyAdminRole
}
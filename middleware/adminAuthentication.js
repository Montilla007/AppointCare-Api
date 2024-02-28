const Admin = require('../models/Admin'); // Change User to Admin
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthenticatedError('Authentication Invalid 1');
    }
    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = { adminId: payload.adminId, name: payload.username };
        next();

    } catch (error) {
        throw new UnauthenticatedError('Authentication Invalid 2');
    }
};

module.exports = auth;

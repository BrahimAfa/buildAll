/* eslint-disable no-underscore-dangle */

const { verify } = require('../utils/jwt');

const auth = async (req, res, next) => {
    const token = req.headers['x-auth-token'];
    console.log('Time:', Date.now());
    /// *console.log('body', req.body);*/
    /// *console.log('TOKEN', token);*/
    if (!token) return res.status(401).json('access_denied');
    const decoded = verify(token);
    if (decoded.errors) return res.status(401).json('invalid_token');
    req.session = {
        user: { _id: decoded._id || null },
    };
    next();
};

module.exports = auth;

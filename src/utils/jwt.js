/* eslint-disable func-names */
const jwt = require('jsonwebtoken');
const config = require('config');

const jwtKey = config.get('jwt.key');
const jwtTtl = config.get('jwt.ttl');

const sign = (payload, hasExpireTime = true) => {
    if (!hasExpireTime) return jwt.sign(payload, jwtKey);
    return jwt.sign(payload, jwtKey, { expiresIn: jwtTtl });
};

const verify = (token) => {
    try {
        /* console.log(jwtKey); */
        const pyload = jwt.verify(token, jwtKey);
        return pyload;
    } catch (error) {
        return { errors: `${error.message}` };
    }
};

const refresh = (token) => {
    const payload = jwt.verify(token, jwtKey);
    delete payload.iat;
    delete payload.exp;
    return jwt.sign(payload, jwtKey /* , { expiresIn: jwtRefreshTtl } */);
};

module.exports = { refresh, verify, sign };

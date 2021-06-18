const bcrypt = require('bcryptjs');

const hash = async (value) => {
    /* console.log('in Hash '); */
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(value, salt);
    return hashed;
};

const hachVerify = async (value, _hash) => bcrypt.compare(value, _hash);

module.exports = { hachVerify, hash };

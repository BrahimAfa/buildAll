/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const express = require('express');
const { getUser, createUser } = require('../controllers/user');
const { generatePayload } = require('../utils/functions');

const { hash, hachVerify } = require('../utils/hash');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { password, email } = req.body;
    if (!password || !email) return send('invalid_email_or_password1', 400);
    const result = await getUser({ filters: { email } });
    if (result.status !== 200) return res.status(400).json('invalid_email_or_password2');
    /* console.log('employee login data', employee); */
    const validePassword = await hachVerify(password, result.data.password);
    if (!validePassword) return res.status(400).json('invalid_email_or_password3');
    const payload = generatePayload(result.data);
    return res.json(payload);
});

router.post('/register', async (req, res) => {
    const { password } = req.body;
    let result;
    if (!password) return res.status(400).json('password_required');
    req.body.password = await hash(password);
    if (req.body.email && req.body.email.length > 0) {
        result = await getUser({ filters: { email: req.body.email } });
        if (result.status === 200) return res.status(400).json('email_already_exist');
    } else return res.status(400).json('email_required');
    result = await createUser({ body: req.body });
    if (result.status !== 200) return res.status(result.status).json(result.data);
    // delete result.data.password;
    const payload = generatePayload(result.data);
    return res.json(payload);
});

module.exports = router;

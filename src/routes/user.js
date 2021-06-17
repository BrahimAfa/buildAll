/* eslint-disable camelcase */
const express = require('express');
const User = require('../models/user');
const { to } = require('../utils/functions');

const router = express.Router();

router.post('/', async (req, res) => {
    const { body } = req;
    const user = new User(body);
    const { result, error } = await to(user.save());
    if (error) return res.status(400).json(error.message);
    if (!result) return res.status(400).json('user_not_found');
    return res.json(result);
});

router.get('/', async (req, res) => {
    const fields = [''];
    const filters = {};
    const { result, error } = await to(User.find(filters, fields));
    if (error) return res.status(400).json(error.message);
    if (!result) return res.status(404).json('user_not_found');
    return res.json(result);
});

router.get('/:id', async (req, res) => {
    const { params } = req;
    const fields = [];
    const filters = { _id: params.id };
    const { result, error } = await to(User.findOne(filters, fields));
    if (error) return res.status(400).json(error.message);
    if (!result) return res.status(404).json('user_not_found');
    return res.json(result);
});

module.exports = router;

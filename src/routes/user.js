/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const express = require('express');
const { createUser, getUser, getUsers, deleteUser } = require('../controllers/user');

const router = express.Router();

router.get('/', async (req, res) => {
    const filters = {};
    const result = await getUsers({ filters });
    if (result.status !== 200) return res.status(result.status).json(result.data);
    return res.json(result.data);
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const result = await getUser({ filters: { _id: id } });
    if (result.status !== 200) return res.status(result.status).json(result.data);
    return res.json(result.data);
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const result = await deleteUser({ id });
    if (result.status !== 200) return res.status(result.status).json(result.data);
    return res.json(result.data);
});

router.post('/me', async (req, res) => {
    const query = { filters: { _id: req.session.user._id }, fields: ['-password'] };
    const result = await getUser(query);
    if (result.status !== 200) return res.status(result.status).json(result.data);
    return res.json(result.data);
});

module.exports = router;

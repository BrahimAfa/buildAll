/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();

router.post('/', async (req, res) => res.json('user post'));

router.get('/', async (req, res) => res.json('user GET'));

module.exports = router;

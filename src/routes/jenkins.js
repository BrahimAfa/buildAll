/* eslint-disable camelcase */
const express = require('express');
const fs = require('fs');

const router = express.Router();
const { resolvePipline } = require('../utils/functions');

router.all('/:pipline', async (req, res) => {
    fs.writeFile('github.json', req.data);
    console.log(req.params);
    const { pipline } = req.params;
    const { appType } = req.query;
    try {
        const response = await resolvePipline({ pipline, appType });
        res.send(response.data);
    } catch (error) {
        const msg = error.response ? error.response.data : error.message;
        res.send(msg);
    }
});

module.exports = router;

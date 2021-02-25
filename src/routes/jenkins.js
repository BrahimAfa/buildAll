/* eslint-disable camelcase */
const { log } = require('console');
const express = require('express');
const fs = require('fs');

const router = express.Router();
const { resolvePipline } = require('../utils/functions');

router.all('/:pipline', async (req, res) => {
    console.log(req.body);
    fs.writeFile('github.json', JSON.stringify(req.body), (err) => {
        console.log(err);
    });
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

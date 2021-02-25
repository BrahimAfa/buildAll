/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();
const { resolvePipline } = require('../utils/functions');

router.get('/:pipline', async (req, res) => {
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

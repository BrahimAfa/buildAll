// if this is built with TS or used babel, this app.js should be inside src/
const express = require('express');

const app = express();
const { jenkinsRoute } = require('./src/routes');
const startUp = require('./src/config/Server');

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/', jenkinsRoute);

startUp(app);

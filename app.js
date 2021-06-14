// if this is built with TS or used babel, this app.js should be inside src/
const path = require('path');

global.appRoot = path.resolve(__dirname);
const express = require('express');

const app = express();
const { jenkinsRoute, buildRoute } = require('./src/routes');
const startUp = require('./src/config/Server');

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/', buildRoute);
app.use('/j', jenkinsRoute);

startUp(app);

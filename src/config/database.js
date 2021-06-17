const mongoose = require('mongoose');
const { IsPROD } = require('../utils/constants');
const Config = require('config');

const initializeDB = async () => {
    try {
        const { host, username, password, name } = Config.get('db');
        let mongoConnection = host;
        if (IsPROD) mongoConnection = `mongodb://${username}:${password}@${host}/${name}`;
        await mongoose.connect(mongoConnection, { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
        console.log('database Connected...');
    } catch (error) {
        console.error(error)
        console.log('Connection to database not Etablished...');
        process.exit(1);
    }
};

const closeDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('Database Closed...');
    } catch (ex) {
        console.log('Database crushed While Closing...');
        process.exit(1);
    }
};

module.exports = { closeDB, initializeDB };

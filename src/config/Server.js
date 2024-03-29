const http = require('http');
const { PORT } = require('../utils/constants');
const { initializeDB, closeDB } = require('./database');

let httpServer;
function initServer(app) {
    return new Promise((resolve, reject) => {
        httpServer = http.createServer(app);
        httpServer.listen(PORT)
            .on('listening', () => {
                resolve();
            })
            .on('error', (err) => {
                reject(err);
            });
    });
}

// The close function returns a promise that is resolved when the web server is successfully closed
// The httpServer.close method stops new connections from being established,
// but it will not force already opened connections closed
function close() {
    return new Promise((resolve, reject) => {
        httpServer.close((err) => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });
}

const Startup = async (app) => {
    try {
        // awaiting the Promise to Resolve Or reject...
        await initServer(app);
        await initializeDB();
        console.log(`Server is Live on ${PORT} 🚀`);
    } catch (err) {
        console.log('Server is not running...⚠⚠', err);
        // log err to file Later with Morgan or Winston
    }
};

const Shutdown = async (Uncaughtex) => {
    let err = Uncaughtex;
    try {
        console.log('Shutting down Server...');
        console.log(err);
        await close();
        await closeDB();
    } catch (ex) {
        err = err || ex;
        // log with winston Later..:);
        console.log(ex);
    }
    if (err) {
        process.exit(1); // non-Zero Exit Means Failaiur
        return;
    }
    process.exit(0);
};

// SIGINT and SIGTERM events are related to signals that can be sent to the process to shut it down
// like ctrl+C...
process.on('SIGINT', () => {
    console.log('Received SIGINT');
    Shutdown();
});
process.on('SIGTERM', () => {
    console.log('Received SIGTERM');
    Shutdown();
});
// The uncaughtException event will occur when a JavaScript error is thrown
// but not caught and handled with a try-catch statement.

process.on('uncaughtException', (error) => {
    console.log('uncaughtException');
    // logger.info('uncaughtException :: ', err)
    // Winston.error('uncaughtException :: ', err);
    // this exception will be logged in shutdown Function
    Shutdown(error);
});

module.exports = Startup;
// exports.Shutdown = Shutdown;

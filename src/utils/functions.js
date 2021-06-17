const axios = require('axios');
const config = require('config');
const { exec } = require('child_process');
const fs = require('fs');
const { promisify } = require('util');

const sendRequest = async (configParams) => {
    const { user, accessKey, token, host, port } = config.get('jenkins');
    const { pipline, appType } = configParams;
    const url = `http://${user}:${accessKey}@${host}:${port}/job/${pipline}/buildWithParameters?token=${token}&appType=${appType}`;
    return axios.post(url, {}, {});
};

module.exports.exec = (cmd) => new Promise((resolve, reject) => {
    console.log(`[COMMAND] ${cmd}`);
    exec(cmd, (error, stdout, stderr) => {
        if (error) console.warn('[ERROR]', error);
        const result = {
            // only pick cmd
            error: error ? { cmd: error.cmd } : null,
            message: stdout || stderr,
        };
        resolve(result);
    });
});

exports.randomPort = () => {
    const max = 65353;
    const min = 2000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const to = async (promise) => {
    try {
        // /*console.log("Was in to 1");*/
        const result = await promise;
        // /*console.log("Was in to 2",result);*/
        return { result };
    } catch (error) {
        if (error.errmsg) {
            /* console.log(error.errmsg); */
            if (error.code && error.code === 11000) {
                if (!error.keyValue) {
                    const field = (/(index: (\w+)(_\d+))/).exec(error.message)[2];
                    error.message = `duplicate_${field.toLowerCase()}`;
                } else {
                    error.message = `duplicate_${Object.keys(error.keyValue).join(',').toLowerCase()}`;
                }
            }
        } else {
            const firstError = error.errors ? error.errors[Object.keys(error.errors)[0]] : error.message;
            error.message = `${firstError.path}_${firstError.kind}`.toLowerCase();
        }
        if (!error.status) error.status = 500;
        return { error };
    }
};

exports.resolvePipline = async (configParams) => sendRequest({ ...configParams });

module.exports.send = (data, status = 200) => ({ data, status });

module.exports.writeFile = promisify(fs.writeFile);
module.exports.appendFile = promisify(fs.appendFile);
module.exports.to = to;

module.exports.readFile = promisify(fs.readFile);
module.exports.copyFile = promisify(fs.copyFile);

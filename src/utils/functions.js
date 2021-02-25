const axios = require('axios');
const config = require('config');

const sendRequest = async (configParams) => {
    const { user, accessKey, token, host, port } = config.get('jenkins');
    const { pipline, appType} = configParams;
    const url = `http://${user}:${accessKey}@${host}:${port}/job/${pipline}/buildWithParameters?token=${token}&appType=${appType}`;
    return axios.post(url, {}, {});
};

exports.resolvePipline = async (configParams) => sendRequest({ ...configParams });

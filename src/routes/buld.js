/* eslint-disable camelcase */

// ['php','jee' ,'core', 'spring', 'angular','react','nodejs']
const express = require('express');
const { ConfigureDatabase, buildAndRunDockerImage, cloneRepoAndAddDockerFile, setUpNginxConfiguration } = require('./config');

const router = express.Router();
const { logme } = require('../utils/logger');

// const body =
router.post('/build', async (req, res) => {
    const { body } = req;
    console.log(req.body);
    const repoInfo = {};
    if (!body.repository) return res.status(400).send('Repo Required');
    const splitedRepo = body.repository.split('/');
    [,,, repoInfo.user, repoInfo.repoName] = splitedRepo;
    repoInfo.repoNameCleaned = repoInfo.repoName.replace(/-|.git/, '').toLocaleLowerCase();
    repoInfo.user = repoInfo.user.replace(/-|_|@/, '').toLocaleLowerCase();
    const imageName = `${repoInfo.user}/${repoInfo.repoNameCleaned}`;
    const containerName = `${repoInfo.user}-${repoInfo.repoNameCleaned}`;

    console.log(repoInfo);
    (async () => {
        // await cloneRepoAndAddDockerFile({ ...body, folderName: containerName });
        await ConfigureDatabase(body); // build BB
        await buildAndRunDockerImage({ repositoryName: repoInfo.repoName, containerName, imageName });
        await setUpNginxConfiguration({ containerName, customPort: body.customPort });
    })();

    return res.send('done');
});

module.exports = router;

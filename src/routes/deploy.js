/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */

// ['php','jee' ,'core', 'spring', 'angular','react','nodejs']
const express = require('express');

const { ConfigureDatabase, buildAndRunDockerImage, cloneRepoAndAddDockerFile, setUpNginxConfiguration } = require('./config');

const router = express.Router();
const { createProjectForDeployment, updateProject } = require('../controllers/project');

const defaultPort = (projectType, customPort) => {
    switch (projectType) {
    case 'core':
        return 80;
    case 'php':
        return 80;
    default:
        return customPort;
    }
};
// const body =
router.post('/', async (req, res) => {
    req.session = { user: { _id: '60caa492c56394e7e3ec4a86' } };
    const { body } = req;
    console.log(req.body);
    const repoInfo = {};
    if (!body.repository) return res.status(400).send('Repositort Required');
    const projectIndex = ['angular', 'react', 'vue', 'php', 'core', 'spring', 'j2ee'].indexOf(body.projectType);
    if (projectIndex === -1) return res.status(400).send('Project Type Not Supported');
    const isStaticProject = projectIndex <= 2; // if project type index is in the first three choices (angular=>0,react=>1,vue=>2) its a static project
    const splitedRepo = body.repository.split('/');
    [,,, repoInfo.user, repoInfo.repoName] = splitedRepo;
    repoInfo.repoName = repoInfo.repoName.replace('.git', '');
    repoInfo.repoNameCleaned = repoInfo.repoName.replace(/-/gi, '').toLocaleLowerCase();
    repoInfo.user = repoInfo.user.replace(/-|_|@/, '').toLocaleLowerCase();
    const imageName = `${repoInfo.user}/${repoInfo.repoNameCleaned}`;
    const containerName = `${repoInfo.user}-${repoInfo.repoNameCleaned}`;
    body.projectType = body.projectType.toLocaleLowerCase();

    const customPort = defaultPort(body.projectType, body.customPort);
    console.log(repoInfo);

    // return res.send('done');
    // update after => image,
    const projectBody = {
        name: containerName,
        projectType: body.projectType,
        dbType: body.dbType,
        repository: body.repository,
    };
    let result;

    const projectResult = await createProjectForDeployment({ body: projectBody });
    // TODO -  project already exist and was in pending state we should stop the process
    // this means that the project is still deploying
    if (projectResult.status !== 200) return res.status(projectResult.status).json(projectResult.data);
    (async () => {
        const messages = [];
        let folderName = containerName;
        const chnagedConfiguration = {}; // this variable holds information if changed in some step;
        result = await cloneRepoAndAddDockerFile({ ...body, folderName }, chnagedConfiguration);
        if (result.status !== 200) {
            const updateBody = {
                faildReason: result.data,
                status: 'FAILD',
            };
            const updateFilter = {
                _id: projectResult.data._id,
            };
            const r = await updateProject({ body: updateBody, filters: updateFilter });
            console.log('in update', r);

            return res.status(400).json({ error: result.data });
        }
        messages.push(result.data);

        if (chnagedConfiguration.folderName) folderName = chnagedConfiguration.folderName;
        if (!isStaticProject) {
            result = await ConfigureDatabase(body); // build BB
            if (result.status !== 200) {
                const updateBody = {
                    faildReason: result.data,
                    status: 'FAILD',
                };
                const updateFilter = {
                    _id: projectResult.data._id,
                };
                const r = await updateProject({ body: updateBody, filters: updateFilter });
                console.log('in update', r);
                return res.status(400).json({ error: result.data });
            }
            messages.push(result.data);
        }

        result = await buildAndRunDockerImage({ folderName, containerName, imageName });
        if (result.status !== 200) {
            const updateBody = {
                faildReason: result.data,
                status: 'FAILD',
            };
            const updateFilter = {
                _id: projectResult.data._id,
            };
            const r = await updateProject({ body: updateBody, filters: updateFilter });
            console.log('in update', r);
            return res.status(400).json({ error: result.data });
        }
        messages.push(result.data);

        result = await setUpNginxConfiguration({ containerName, customPort });
        if (result.status !== 200) {
            const updateBody = {
                faildReason: result.data,
                status: 'FAILD',
            };
            const updateFilter = {
                _id: projectResult.data._id,
            };
            const r = await updateProject({ body: updateBody, filters: updateFilter });
            console.log('in update', r);
            return res.status(400).json({ error: result.data });
        }
        messages.push(result.data);
        const updateBody = {
            status: 'DEPLOYED',
            url: `${containerName}.duplo.com`,
        };
        const updateFilter = {
            _id: projectResult.data._id,
        };
        const r = await updateProject({ body: updateBody, filters: updateFilter });
        console.log('in update', r);
    })();
    return res.json({ message: 'deploying...' });
});

module.exports = router;

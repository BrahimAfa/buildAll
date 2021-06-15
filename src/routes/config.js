const { exec, writeFile, readFile, copyFile, randomPort, send } = require('../utils/functions');
const { logme } = require('../utils/logger');

function handleShellresult(result, step) {
    console.log(result);
    const { error, message } = result;
    // db ERRORS FROM 700 to 799
    // container Errors From 600 to 699
    // Git errors From 500 to 599
    // ERROR 400 error not treated well (mazal madartch lih logic dyalo m had l error)
    if (!error) return send(`[DONE] ${step} passed Succefully`);
    const isDBExist = message.includes('database exists');
    if (isDBExist) return send('[ERROR] The Database Already Exist', 700);
    const isContainerAlreadyUsed = message.includes('already in use');
    if (isContainerAlreadyUsed) return send('[ERROR] This Container is Already Running', 600);
    const isGitFolderAlreadyExist = message.includes('already exists and is not an empty directory');
    if (isGitFolderAlreadyExist) return send('[ERROR] Git Folder [With] The SAME Name Already Exists', 500);

    return send(`Error Was Incoutred in step : ${step}`, 400);
}

async function cloneRepoAndAddDockerFile({ repository, projectType, folderName, extra },chnagedConfiguration) {
    const step = 'Clonning the repo';
    logme(step);
    let result = await exec(`cd /repos; git clone ${repository} ${folderName}`); // FIXEME : add clone name to this!!
    let HandledResult = handleShellresult(result, step);
    if (HandledResult.status !== 200) {
        if (HandledResult.status === 500) {
            result = await exec(`cd /repos/${folderName} ; git pull`);
            HandledResult = handleShellresult(result, step);
            if (HandledResult.status !== 200) return send(HandledResult.data, HandledResult.status);
            // eslint-disable-next-line no-param-reassign
            extra = 'Github Repository Already Exist, Only New Changes Were Pulled';
        } else {
            return send(HandledResult.data, HandledResult.status);
        }
    }
    try {
        logme('adding docker file');
        const type = projectType.toLocaleLowerCase();
        if (type === 'core') {
            result = await exec(`find /repos/${folderName} -name "*.sln"`);
            if (!result.message) return send('[ERROR] There is No Solution file (.sln) in this repo ');
            const solutionPathSplited = result.message.split('/');
            solutionPathSplited.splice(solutionPathSplited.length - 1, 1);
            solutionPathSplited.splice(0 ,2); // remove repos ['','rep']

            const solutionFolder = solutionPathSplited.join('/');
            console.log('woooooooooow', solutionFolder);
            // eslint-disable-next-line no-param-reassign
            folderName = solutionFolder;
            chnagedConfiguration.folderName = solutionFolder;
            if (HandledResult.status !== 200) return send(HandledResult.data, HandledResult.status);
            result = await copyFile(`${global.appRoot}/dockerfiles/entrypoint-core.sh`, `/repos/${folderName}/entrypoint.sh`);
        }
        result = await copyFile(`${global.appRoot}/dockerfiles/Dockerfile-${type}`, `/repos/${folderName}/Dockerfile`);
        console.log('[DONE] FILE COPY RESULT', result);

        let message = '[DONE] Project Cloned and Dockerfile Added';
        if (extra) message += ` [With] ${extra}`;
        return send(message);
    } catch (error) {
        console.log('[ERROR] copy docker file', error);
        return send('[ERROR] copy docker file', 400);
    }
}

async function buildAndRunDockerImage({ folderName, containerName, imageName, extra }) {
    let step = 'Building the Docker image';
    logme(step);
    let result;
    if (!extra) {
        result = await exec(`cd /repos/${folderName}; docker build -t ${imageName} .`);
        console.log(step, result);
    }
    step = 'Running the docker image';
    logme(step);
    result = await exec(`docker run --name ${containerName} --rm -d --net ensas-net ${imageName}`);
    let HandledResult = handleShellresult(result, step);
    let messageAfterReRunnung;
    if (HandledResult.status !== 200) {
        if (HandledResult.status === 600) {
            step = 'Removing Docker Container';
            result = await exec(`docker rm ${containerName} -f`);
            HandledResult = handleShellresult(result, step);
            console.log(step, HandledResult);
            if (HandledResult.status !== 200) return send(HandledResult.data, HandledResult.status);
            result = await buildAndRunDockerImage({ folderName, containerName, imageName, extra: `Container ${containerName} Was Running and Stopped` });
            messageAfterReRunnung = result.data;
        } else return send(HandledResult.data, HandledResult.status);
    }
    let message = messageAfterReRunnung || `[DONE] ${step}`;
    if (extra) message += ` [With] ${extra}`;
    return send(message, 200);
}

async function setUpNginxConfiguration({ containerName, customPort }) {
    let step = 'Set Up Nginx Location';
    logme(step);
    const defaultNginxLoncationConf = await readFile(`${global.appRoot}/templates/nginx-location.conf`);
    // eslint-disable-next-line consistent-return
    const replacedNginxConf = defaultNginxLoncationConf.toString().replace(/(?<name>__NAME__)|(?<port>__PORT__)/gm, (...matche) => {
        const groups = matche.pop();
        console.log(groups);
        if (groups.name) return containerName;
        if (groups.port) return customPort;
    });
    await writeFile(`${global.appRoot}/nginx/config/${containerName}.conf`, replacedNginxConf, 'utf8');
    step = 'Relaoding Nginx';
    logme(step);
    const result = await exec('docker exec nginx sh -c "nginx -t && nginx -s reload"');// if config is good reload service.
    const HandledResult = handleShellresult(result, step);
    if (HandledResult.status !== 200) return send(HandledResult.data, HandledResult.status);
    return send('[DONE] Nginx Configuration Passed ^^');
}

async function ConfigureDatabaseMyql({ sqlFile, extra }) {
    let HandledResult;
    console.log(1);
    let result;
    const step = 'Configuring Mysql Database';
    console.log(2);

    result = await exec(`docker exec mysql2 sh -c "mysql -uroot -proot < /DB_SHARED_FILES/${sqlFile}"`);
    HandledResult = handleShellresult(result, step);
    let messageAfterDbError;
    console.log(3);
    if (HandledResult.status !== 200) {
        console.log(4);

        if (HandledResult.status === 700) {
            console.log(5);

            // needs -REVIEW-  this line gets the database name from the previous error by spliting.
            const databaseName = result.message.split('create database')[1].split(';')[0].replace(/'|"/g, '');
            console.log(6);

            result = await exec(`docker exec mysql2 sh -c "mysqladmin -uroot -proot drop -f ${databaseName}"`);
            console.log(6);

            HandledResult = handleShellresult(result, step);
            console.log(7);

            if (HandledResult.status !== 200) return send(HandledResult.data, HandledResult.status);

            console.log(8);
            result = await ConfigureDatabaseMyql({ sqlFile, extra: `Database '${databaseName}' Was Droped` });
            console.log('result', result);
            messageAfterDbError = result.data;
        } else return send(HandledResult.data, HandledResult.status);
        console.log(9);
    }
    let message = messageAfterDbError || '[DONE] Database Imported';
    if (extra) message += ` [With] : ${extra}`; // in cas if any changes are made after an error is happend
    return send(message);
}

async function ConfigureDatabase({ dbType, sqlFile }) {
    // TODO - check if drop exist in this file!!
    logme(`Set up Database [${dbType}]`);
    switch (dbType) {
    case 'mysql2':
        return ConfigureDatabaseMyql({ sqlFile });
    case 'mssql':
        return send('[DONE] MSSQL useses EF6 to Build database');
    case 'MONGODB':
        return send('[ERROR] Not Implemented Yet', 400);
    default:
        return send(`[ERROR] ${dbType} Not Implemented Yet`, 400);
    }
}

module.exports.ConfigureDatabase = ConfigureDatabase;
module.exports.cloneRepoAndAddDockerFile = cloneRepoAndAddDockerFile;
module.exports.buildAndRunDockerImage = buildAndRunDockerImage;
module.exports.setUpNginxConfiguration = setUpNginxConfiguration;

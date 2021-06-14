const { exec, writeFile, readFile, copyFile, randomPort, send } = require('../utils/functions');
const { logme } = require('../utils/logger');

function handleShellresult(result,step) {
    const { error, message } = result;
    if(!error) return send(`[DONE] ${step} passed Succefully`);
    const isDBExist = message.includes('database exists');
    if(isDBExist) return send('The Database Already Exist', 400);
    return send(message,400);
}

async function cloneRepoAndAddDockerFile({ repository, projectType, repositoryName,folderName }) {
    logme('Clonning the repo');
    let result = await exec(`cd /repos; git clone ${repository} ${folderName}`); // FIXEME : add clone name to this!!
    console.log(result);
    try {
        const type = projectType.toLocaleLowerCase();
        logme('adding docker file');
        result = await copyFile(`${global.appRoot}/dockerfiles/Dockerfil-${type}`, `/repos/${repositoryName}/Dockerfile`);
        console.log();
    } catch (error) {
        console.log('[ERROR] copy docker file', error);
    }
}

async function buildAndRunDockerImage({ repositoryName, containerName, imageName }) {
    logme('Building the Docker image');
    let result = await exec(`cd /repos/${repositoryName}; docker build -t ${imageName} .`);
    console.log(result);
    logme('Running the docker image');
    result = await exec(`docker run --name ${containerName} --rm -d --net ensas-net ${imageName}`);
    console.log(result);

}

async function setUpNginxConfiguration({ containerName, customPort }) {
    logme('Set Up Nginx Location');
    const defaultNginxLoncationConf = await readFile(`${global.appRoot}/templates/nginx-location.conf`);
    // eslint-disable-next-line consistent-return
    const replacedNginxConf = defaultNginxLoncationConf.toString().replace(/(?<name>__NAME__)|(?<port>__PORT__)/gm, (...matche) => {
        const groups = matche.pop();
        console.log(groups);
        if (groups.name) return containerName;
        if (groups.port) return customPort;
    });
    await writeFile(`${global.appRoot}/nginx/config/${containerName}.ensas-conf`, replacedNginxConf, 'utf8');
    logme('resload nginx ');
    let result = await exec('docker exec nginx sh -c "nginx -t && nginx -s reload"');// if config is good reload service.
    console.log(result);
}

async function ConfigureDatabase({ dbType, sqlFile }) {
    // TODO - check if drop exist in this file!!
    logme(`Set up Database [${dbType}]`);
    let result;
    switch (dbType) {
    case 'mysql2':
        result = await exec(`docker exec ${dbType} sh -c "mysql -uroot -proot < /DB_SHARED_FILES/${sqlFile}"`);
        return handleShellresult(result);
    case 'MSSQL':
        console.log('this Not Implimented Yet!!!');
        break;
    case 'MONGODB':
        console.log('this Not Implimented Yet!!!');
        break;
    default:
        break;
    }
}

module.exports.ConfigureDatabase = ConfigureDatabase;
module.exports.cloneRepoAndAddDockerFile = cloneRepoAndAddDockerFile;
module.exports.buildAndRunDockerImage = buildAndRunDockerImage;
module.exports.setUpNginxConfiguration = setUpNginxConfiguration;

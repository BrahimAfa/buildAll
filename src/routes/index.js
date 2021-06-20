/* eslint-disable global-require */
module.exports = {
    jenkinsRoute: require('./jenkins'),
    buildRoute: require('./deploy'),
    userRoutes: require('./user'),
    projectRoutes: require('./project'),
    authentication: require('./authenticat'),

};

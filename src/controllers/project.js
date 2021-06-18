/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
const Project = require('../models/project');
const { send, to } = require('../utils/functions');

const createProject = async ({ body }) => {
    const project = new Project(body);
    const { result, error } = await to(project.save());
    if (error) return send(error.message, 400);
    if (!result) return send('project_not_created', 400);
    return send(result);
};

const getProject = async ({ id, fields = [] }) => {
    fields = fields.join(' ');
    const filters = { _id: id };
    const { result, error } = await to(Project.findOne(filters, fields));
    if (error) return send(error.message, 400);
    if (!result) return send('project_not_found', 404);
    return send(result);
};

const getProjects = async ({ filters, fields = [] }) => {
    fields = fields.join(' ');
    const { result, error } = await to(Project.find(filters, fields));
    if (error) return send(error.message, 400);
    if (!result) return send('project_not_found', 404);
    return send(result);
};

const updateProject = async ({ body, filters, options = {} }) => {
    options.new = true;
    options.runValidators = true;
    const { result, error } = await to(Project.findOneAndUpdate(filters, body, options));
    if (error) return send(error.message, 400);
    if (!result) return send('project_not_updated', 404);
    return send(result);
};

const deleteManyProjects = async ({ filters = {} }) => {
    const { result, error } = await to(Project.deleteMany(filters));
    if (error) return send(error.message, 400);
    if (!result) return send('projects_not_deleted', 404);
    return send(result);
};

const deleteProject = async ({ id }) => {
    const filters = { _id: id };
    const { result, error } = await to(Project.deleteOne(filters));
    if (error) return send(error.message, 400);
    if (!result) return send('project_not_deleted', 404);
    return send(result);
};

module.exports = { createProject, getProject, getProjects, updateProject, deleteProject, deleteManyProjects };

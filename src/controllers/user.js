const User = require('../models/user');
const { send, to } = require('../utils/functions');

const createUser = async ({ body }) => {
    const user = new User(body);
    const { result, error } = await to(user.save());
    if (error) return send(error.message, 400);
    if (!result) return send('user_not_created', 400);
    return send(result);
};

const getUser = async ({ filters={}, fields = [] }) => {
    fields = fields.join(' ');
    const { result, error } = await to(User.findOne(filters, fields));
    if (error) return send(error.message, 400);
    if (!result) return send('user_not_found', 404);
    return send(result);
};

const getUsers = async ({ filters = {}, fields = [] }) => {
    fields = fields.join(' ');
    const { result, error } = await to(User.find(filters, fields));
    if (error) return send(error.message, 400);
    if (!result) return send('user_not_found');
    return send(result);
};

const deleteManyUsers = async ({ filters = {} }) => {
    const { result, error } = await to(User.deleteMany(filters));
    if (error) return send(error.message, 400);
    if (!result) return send('projects_not_deleted', 404);
    return send(result);
};

const deleteUser = async ({ id }) => {
    const filters = { _id: id };
    const { result, error } = await to(User.deleteOne(filters));
    if (error) return send(error.message, 400);
    if (!result) return send('user_not_deleted', 404);
    return send(result);
};

module.exports = { createUser, getUser, getUsers, deleteManyUsers, deleteUser };

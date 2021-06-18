/* eslint-disable camelcase */
const express = require('express');
const { createProject, getProject, getProjects, deleteManyProjects, deleteProject } = require('../controllers/project');
const auth = require('../middleware/auth');

const router = express.Router();
// router.use(auth);

router.post('/', async (req, res) => {
    const { body } = req;
    const result = await createProject({ body });
    if (result.status !== 200) return res.status(result.status).json(result.data);
    return res.json(result.data);
});

router.get('/', async (req, res) => {
    const filters = {};
    const result = await getProjects({ filters });
    if (result.status !== 200) return res.status(result.status).json(result.data);
    return res.json(result.data);
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const result = await getProject({ id });
    if (result.status !== 200) return res.status(result.status).json(result.data);
    return res.json(result.data);
});

router.delete('/all', async (req, res) => {
    const filters = {};
    const result = await deleteManyProjects({ filters });
    if (result.status !== 200) return res.status(result.status).json(result.data);
    return res.json(result.data);
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const result = await deleteProject({ id });
    if (result.status !== 200) return res.status(result.status).json(result.data);
    return res.json(result.data);
});


module.exports = router;

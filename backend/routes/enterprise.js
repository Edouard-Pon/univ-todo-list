const express = require('express');
const { createEnterprise, getEnterpriseById, updateEnterprise, deleteEnterprise } = require('../models/enterprise');

const router = express.Router();

// Create a new enterprise
router.post('/', async (req, res) => {
    try {
        const enterprise = await createEnterprise(req.body);
        res.status(201).json(enterprise);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get an enterprise by ID
router.get('/:id', async (req, res) => {
    try {
        const enterprise = await getEnterpriseById(req.params.id);
        if (!enterprise) {
            return res.status(404).json({ error: 'Enterprise not found' });
        }
        res.json(enterprise);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an enterprise by ID
router.put('/:id', async (req, res) => {
    try {
        const updated = await updateEnterprise(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ error: 'Enterprise not found' });
        }
        res.json({ message: 'Enterprise updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an enterprise by ID
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await deleteEnterprise(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Enterprise not found' });
        }
        res.json({ message: 'Enterprise deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a team in an enterprise
router.post('/:id/teams', async (req, res) => {
    try {
        const enterprise = await getEnterpriseById(req.params.id);
        if (!enterprise) {
            return res.status(404).json({ error: 'Enterprise not found' });
        }
        const team = { ...req.body, tasks: [] };
        enterprise.teams.push(team);
        await updateEnterprise(req.params.id, enterprise);
        res.status(201).json(team);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Assign a task to a team
router.post('/:id/teams/:teamId/tasks', async (req, res) => {
    try {
        const enterprise = await getEnterpriseById(req.params.id);
        if (!enterprise) {
            return res.status(404).json({ error: 'Enterprise not found' });
        }
        const team = enterprise.teams.find(t => t._id.toString() === req.params.teamId);
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }
        const task = { ...req.body, status: 'not started' };
        team.tasks.push(task);
        await updateEnterprise(req.params.id, enterprise);
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Change task status
router.put('/:id/teams/:teamId/tasks/:taskId/status', async (req, res) => {
    try {
        const enterprise = await getEnterpriseById(req.params.id);
        if (!enterprise) {
            return res.status(404).json({ error: 'Enterprise not found' });
        }
        const team = enterprise.teams.find(t => t._id.toString() === req.params.teamId);
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }
        const task = team.tasks.find(t => t._id.toString() === req.params.taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        task.status = req.body.status;
        await updateEnterprise(req.params.id, enterprise);
        res.json({ message: 'Task status updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
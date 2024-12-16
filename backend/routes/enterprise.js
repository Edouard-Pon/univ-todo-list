const express = require('express');
const { createEnterprise, getEnterpriseById, updateEnterprise, deleteEnterprise,
    assignTeamToEnterprise,
    addTaskToTeam,
    changeTaskStatus,
    getTaskById,
    deleteTask
} = require('../models/enterprise');
const { ObjectId } = require('mongodb');

const router = express.Router();

// Create a new enterprise
router.post('/', async (req, res) => {
    try {
        const data = {}

        if (req.body.name) data.name = req.body.name
        if (req.body.email) data.email = req.body.email
        if (req.body.adresse) data.adresse = req.body.adresse

        if (data.name === undefined || data.email === undefined || data.adresse === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

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
        const data = {}

        if (req.body.name) data.name = req.body.name
        if (req.body.email) data.email = req.body.email
        if (req.body.adresse) data.adresse = req.body.adresse

        if (data.name === undefined || data.email === undefined || data.adresse === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const updated = await updateEnterprise(req.params.id, data);
        if (!updated) {
            return res.status(404).json({ error: 'Enterprise not found' });
        }
        res.status(200).json({ message: 'Enterprise updated successfully' });
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
        res.status(200).json({ message: 'Enterprise deleted successfully' });
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

        const team = {};

        team._id = new ObjectId()
        if (req.body.name) team.name = req.body.name
        team.workers = []
        team.tasks = []

        await assignTeamToEnterprise(req.params.id, team);
        res.status(201).json(team);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Assign a task to a team
router.post('/:id/teams/:teamId/tasks', async (req, res) => {
    try {
        const task = {}

        task._id = new ObjectId()
        if (req.body.name) task.name = req.body.name
        if (req.body.state) task.state = req.body.state
        if (req.body.dateStart) task.dateStart = new Date(req.body.dateStart)
        if (req.body.dateEnd) task.dateEnd = new Date(req.body.dateEnd)

        if (task.name === undefined || task.state === undefined || task.dateStart === undefined || task.dateEnd === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

         if (!await addTaskToTeam(req.params.id, req.params.teamId, task)) {
            return res.status(404).json({ error: 'Enterprise or team not found' });
         }
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Change task status
router.put('/:id/teams/:teamId/tasks/:taskId/status', async (req, res) => {
    try {
        task = {}

        if (req.body.status) task.status = req.body.status

        if (task.status === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!await changeTaskStatus(req.params.id, req.params.teamId, req.params.taskId, task.status)) {
            return res.status(404).json({ error: 'Enterprise, team or task not found' });
        }
        res.json({ message: 'Task status updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get task by ID
router.get('/:id/teams/:teamId/tasks/:taskId', async (req, res) => {
    try {
        const task = await getTaskById(req.params.id, req.params.teamId, req.params.taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a task
router.delete('/:id/teams/:teamId/tasks/:taskId', async (req, res) => {
    try {
        const deleted = await deleteTask(req.params.id, req.params.teamId, req.params.taskId);
        if (!deleted) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Assign a worker to a team
router.post('/:id/teams/:teamId/workers', async (req, res) => {
    try {
        const worker = {}

        if (req.body.id) worker._id = new ObjectId(req.body.id)

        if (!worker._id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!await updateEnterprise(req.params.id, req.params.teamId, worker)) {
            return res.status(404).json({ error: 'Enterprise or team not found' });
        }
        res.status(201).json(req.body);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

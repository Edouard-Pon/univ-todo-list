const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('../database/database');

let db;

(async () => {
    db = await connectToDatabase();
    // Create indexes
    await db.collection('enterprises').createIndex({ name: 1 }, { unique: true });
    await db.collection('enterprises').createIndex({ name: 1, email: 1 }, { unique: true });
    await db.collection('enterprises').createIndex({ "teams.name": 1 }, { unique: true });
})();

const getEnterpriseCollection = () => db.collection('enterprises');

const createEnterprise = async (enterprise) => {
    const collection = getEnterpriseCollection();
    const result = await collection.insertOne(enterprise);
    return { _id: result.insertedId, ...enterprise };
};

const getEnterpriseById = async (id) => {
    const collection = getEnterpriseCollection();
    return await collection.findOne({ _id: new ObjectId(id) });
};

const updateEnterprise = async (id, enterprise) => {
    const collection = getEnterpriseCollection();
    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: enterprise });
    return result.modifiedCount > 0;
};

const deleteEnterprise = async (id) => {
    const collection = getEnterpriseCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
};

const assignTeamToEnterprise = async (enterpriseId, team) => {
    const collection = getEnterpriseCollection();
    const result = await collection.updateOne({ _id: new ObjectId(enterpriseId) }, { $push: { teams: team } });
    return result.modifiedCount > 0;
};

const addTaskToTeam = async (enterpriseId, teamId, task) => {
    const collection = getEnterpriseCollection();
    const result = await collection.updateOne({ _id: new ObjectId(enterpriseId), "teams._id": new ObjectId(teamId) }, { $push: { "teams.$.tasks": task } });
    return result.modifiedCount > 0;
}

const assignWorkerToTeam = async (enterpriseId, teamId, worker) => {
    const collection = getEnterpriseCollection();
    const result = await collection.updateOne({ _id: new ObjectId(enterpriseId), "teams._id": new ObjectId(teamId) }, { $push: { "teams.$.workers": worker } });
    return result.modifiedCount > 0;
}

module.exports = {
    createEnterprise,
    getEnterpriseById,
    updateEnterprise,
    deleteEnterprise,
    assignTeamToEnterprise,
    addTaskToTeam,
    assignWorkerToTeam
};

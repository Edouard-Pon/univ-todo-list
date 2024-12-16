const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('../database/database');

let db;

(async () => {
    db = await connectToDatabase();
    // Create indexes
    await db.collection('enterprises').createIndex({ name: 1 }, { unique: true });
})();

const getEnterpriseCollection = () => db.collection('enterprises');

const createEnterprise = async (enterprise) => {
    const collection = getEnterpriseCollection();
    const result = await collection.insertOne(enterprise);
    return result.ops[0];
};

const getEnterpriseById = async (id) => {
    const collection = getEnterpriseCollection();
    const enterprise = await collection.findOne({ _id: new ObjectId(id) });
    return enterprise;
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

module.exports = {
    createEnterprise,
    getEnterpriseById,
    updateEnterprise,
    deleteEnterprise
};
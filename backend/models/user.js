const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('../database/database');

let db;

(async () => {
    db = await connectToDatabase();
})();

const getUserCollection = () => db.collection('users');

const createUser = async (user) => {
    const collection = getUserCollection();
    const result = await collection.insertOne(user);
    return result.ops[0];
};

const getUserById = async (id) => {
    const collection = getUserCollection();
    const user = await collection.findOne({ _id: new ObjectId(id) });
    return user;
};

const updateUser = async (id, user) => {
    const collection = getUserCollection();
    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: user });
    return result.modifiedCount > 0;
};

const deleteUser = async (id) => {
    const collection = getUserCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
};

module.exports = {
    createUser,
    getUserById,
    updateUser,
    deleteUser
};
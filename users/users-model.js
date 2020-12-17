const db = require("../data/db-config");

function find() {
    return db('users').select('id', 'username');
}

function findBy(filter) {
    return db('users').where(filter);
}

function findById(id) {
    return db('users').select('id', 'username').where({ id }).first();
}

async function add(user) {
    const newId = await db('users').insert(user, 'id');
    console.log(`\nNew ID: ${newId}\n`);
    return findById(newId);
}

const model = {
    find,
    findBy,
    findById,
    add
};

module.exports = model;
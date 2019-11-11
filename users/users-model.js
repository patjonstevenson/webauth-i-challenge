const db = require("../data/db-config");

const model = {
    find: () => db('users').select('id', 'username'),

    findBy: filter => db('users').select('id', 'username').where(filter),

    findById: id => db('users').select('id', 'username').where({ id }),

    add: user => {
        const newId = db('users').insert(user, 'id');
        return this.findById(newId);
    }
};

module.exports = model;
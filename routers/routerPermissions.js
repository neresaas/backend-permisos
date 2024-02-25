const express = require ('express');
const routerPerissions = express.Router();

let permissions = require('../data/permissions');

routerPerissions.get('/', (req, res) => {
    res.json(permissions)
});

module.exports = routerPerissions;
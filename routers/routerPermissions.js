const express = require ('express');
const routerPerissions = express.Router();

let permissions = require('../data/permissions');

routerPerissions.get('/', (req, res) => {
    res.json(permissions)
});

routerPerissions.post('/', (req, res) => {
    let text = req.body.text
    let userId = req.body.userId

    let lastId = permissions[permissions.length - 1].id

    permissions.push({
        id: lastId + 1,
        text: text,
        approbedBy: [],
        userId: userId
    })
    // Para devolver un JSON tiene que ser un objeto, una clave y un valor ------> 1 { clave: valor }
    res.json({ id: lastId + 1 })
});

module.exports = routerPerissions;
const express = require ('express');
const routerUsers = express.Router();

let users = require('../data/users');

routerUsers.get('/', (req, res) => {
    // Map va usuario por usuario y genera una lista nueva que devuelve los objetos que tú especifiques
    res.json(users.map( u => { return { id: u.id, email: u.email} } ))
});

module.exports = routerUsers;
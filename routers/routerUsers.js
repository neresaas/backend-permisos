const express = require ('express');
const routerUsers = express.Router();

let users = require('../data/users');

// Map va usuario por usuario y genera una lista nueva que devuelve los objetos que tú especifiques
routerUsers.get('/', (req, res) => {
    res.json( users.map (u => { return { id: u.id, email: u.email } } ) )
})

routerUsers.get('/:id', (req, res) => {
    
    let id = req.params.id
    if (id == undefined) {
        res.status(400).json({error: 'No id'})
        return
    }
    let user = users.find(u => u.id == id)
    if (user == undefined) {
        res.status(400).json({error: 'Invalid id'})
        return
    }
    res.json({id: user.id, email: user.email})
});

module.exports = routerUsers;